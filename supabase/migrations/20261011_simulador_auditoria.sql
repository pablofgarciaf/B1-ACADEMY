-- Ejecutar antes de desplegar el servidor que envía p_audit.
-- Cada cambio y su auditoría se confirman en la misma transacción.
create table if not exists public.sim_audit_events (
  uid text not null references public.sim_companies(uid) on delete cascade,
  version bigint not null,
  request_id text not null,
  actor_uid text not null,
  actor_email text not null,
  action text not null,
  result text not null,
  occurred_at timestamptz not null,
  changes jsonb not null,
  previous_hash text not null,
  hash text not null,
  primary key (uid, version),
  unique (uid, request_id)
);
create index if not exists sim_audit_events_request_idx on public.sim_audit_events (uid, occurred_at desc);
alter table public.sim_audit_events enable row level security;
revoke all on public.sim_audit_events from anon, authenticated;
grant select, insert on public.sim_audit_events to service_role;

create or replace function public.sim_commit(
  p_uid text, p_email text, p_request_id text, p_fingerprint text, p_action text, p_result text,
  p_expected_version bigint, p_profile jsonb, p_summary jsonb, p_upserts jsonb, p_deletes jsonb, p_audit jsonb
) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_prev public.sim_requests;
  v_actual bigint;
  v_prev_hash text;
  v_payload jsonb;
  v_hash text;
begin
  if p_audit is null or p_audit->>'actorUid' is null or p_audit->>'occurredAt' is null
     or jsonb_typeof(p_audit->'changes') <> 'array' then
    raise exception 'Falta la evidencia de auditoría.';
  end if;
  if p_audit->>'companyId' <> p_uid or p_audit->>'requestId' <> p_request_id
     or p_audit->>'action' <> p_action or p_audit->>'result' <> p_result then
    raise exception 'La auditoría no coincide con la operación.';
  end if;

  select * into v_prev from public.sim_requests where uid = p_uid and request_id = p_request_id;
  if found then
    if v_prev.fingerprint <> p_fingerprint then
      raise exception 'La solicitud ya fue usada para otra operación.';
    end if;
    return jsonb_build_object('status', 'duplicate', 'result', v_prev.result);
  end if;

  insert into public.sim_companies (uid, email) values (p_uid, p_email) on conflict (uid) do nothing;
  select version into v_actual from public.sim_companies where uid = p_uid for update;
  if v_actual <> p_expected_version then
    return jsonb_build_object('status', 'conflict');
  end if;
  select hash into v_prev_hash from public.sim_audit_events
   where uid = p_uid order by version desc limit 1;
  v_prev_hash := coalesce(v_prev_hash, repeat('0', 64));
  v_payload := jsonb_build_object(
    'companyId', p_uid, 'version', v_actual + 1,
    'actorUid', p_audit->>'actorUid', 'actorEmail', p_audit->>'actorEmail',
    'requestId', p_request_id, 'action', p_action, 'result', p_result,
    'occurredAt', p_audit->>'occurredAt', 'changes', p_audit->'changes',
    'previousHash', v_prev_hash
  );
  v_hash := encode(pg_catalog.sha256(pg_catalog.convert_to(v_payload::text, 'UTF8')), 'hex');

  insert into public.sim_entities (uid, collection, id, data, updated_at)
  select p_uid, u->>'c', u->>'id', u->'d', now()
  from jsonb_array_elements(coalesce(p_upserts, '[]'::jsonb)) u
  on conflict (uid, collection, id) do update set data = excluded.data, updated_at = now();

  delete from public.sim_entities e using jsonb_array_elements(coalesce(p_deletes, '[]'::jsonb)) d
  where e.uid = p_uid and e.collection = d->>'c' and e.id = d->>'id';

  update public.sim_companies
     set version = version + 1, email = coalesce(p_email, email),
         profile = coalesce(p_profile, profile),
         summary = case when p_profile is null then summary else coalesce(p_summary, summary) end,
         updated_at = now()
   where uid = p_uid;

  insert into public.sim_requests (uid, request_id, fingerprint, action, result)
  values (p_uid, p_request_id, p_fingerprint, p_action, p_result);
  insert into public.sim_audit_events
    (uid, version, request_id, actor_uid, actor_email, action, result, occurred_at, changes, previous_hash, hash)
  values
    (p_uid, v_actual + 1, p_request_id, p_audit->>'actorUid', p_audit->>'actorEmail',
     p_action, p_result, (p_audit->>'occurredAt')::timestamptz, p_audit->'changes', v_prev_hash, v_hash);
  return jsonb_build_object('status', 'ok', 'result', p_result);
end;
$$;

-- La firma antigua se retira para impedir cambios sin evidencia.
drop function if exists public.sim_commit(text, text, text, text, text, text, bigint, jsonb, jsonb, jsonb);
revoke execute on function public.sim_commit(text, text, text, text, text, text, bigint, jsonb, jsonb, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.sim_commit(text, text, text, text, text, text, bigint, jsonb, jsonb, jsonb, jsonb) to service_role;

create or replace function public.sim_read_audit(p_uid text, p_limit integer default 100, p_before bigint default null)
returns setof public.sim_audit_events language sql stable security invoker set search_path = '' as $$
  select * from public.sim_audit_events
  where uid = p_uid and (p_before is null or version < p_before)
  order by version desc limit least(greatest(p_limit, 1), 100);
$$;
revoke execute on function public.sim_read_audit(text, integer, bigint) from public, anon, authenticated;
grant execute on function public.sim_read_audit(text, integer, bigint) to service_role;

create or replace function public.sim_verify_audit(p_uid text)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare
  v_row public.sim_audit_events;
  v_prev text := repeat('0', 64);
  v_expected text;
  v_count integer := 0;
  v_version bigint;
begin
  for v_row in select * from public.sim_audit_events where uid = p_uid order by version loop
    if v_row.previous_hash <> v_prev or (v_version is not null and v_row.version <> v_version + 1) then
      return jsonb_build_object('valid', false, 'checked', v_count, 'firstBadVersion', v_row.version);
    end if;
    v_expected := encode(pg_catalog.sha256(pg_catalog.convert_to(jsonb_build_object(
      'companyId', v_row.uid, 'version', v_row.version, 'actorUid', v_row.actor_uid,
      'actorEmail', v_row.actor_email, 'requestId', v_row.request_id,
      'action', v_row.action, 'result', v_row.result, 'occurredAt',
      to_char(v_row.occurred_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
      'changes', v_row.changes, 'previousHash', v_row.previous_hash
    )::text, 'UTF8')), 'hex');
    if v_expected <> v_row.hash then
      return jsonb_build_object('valid', false, 'checked', v_count, 'firstBadVersion', v_row.version);
    end if;
    v_prev := v_row.hash;
    v_version := v_row.version;
    v_count := v_count + 1;
  end loop;
  return jsonb_build_object('valid', true, 'checked', v_count);
end;
$$;
revoke execute on function public.sim_verify_audit(text) from public, anon, authenticated;
grant execute on function public.sim_verify_audit(text) to service_role;

-- La asignación docente también cambia la versión de la empresa y debe dejar evidencia.
create or replace function public.sim_add_mission(p_uid text, p_mission jsonb)
returns text language plpgsql security invoker set search_path = '' as $$
declare
  v_version bigint;
  v_prev_hash text;
  v_payload jsonb;
  v_hash text;
  v_at text;
begin
  select version into v_version from public.sim_companies
   where uid = p_uid and profile is not null for update;
  if not found then raise exception 'Empresa inexistente.'; end if;
  if exists (select 1 from public.sim_entities where uid = p_uid and collection = 'missions' and id = p_mission->>'id') then
    return p_mission->>'id';
  end if;
  select hash into v_prev_hash from public.sim_audit_events where uid = p_uid order by version desc limit 1;
  v_prev_hash := coalesce(v_prev_hash, repeat('0', 64));
  v_at := coalesce(p_mission->>'createdAt', to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));
  v_payload := jsonb_build_object(
    'companyId', p_uid, 'version', v_version + 1, 'actorUid', p_mission->>'teacherUid',
    'actorEmail', '', 'requestId', p_mission->>'id', 'action', 'assignMission',
    'result', p_mission->>'id', 'occurredAt', v_at,
    'changes', jsonb_build_array(jsonb_build_object('collection', 'missions', 'id', p_mission->>'id', 'before', null, 'after', p_mission)),
    'previousHash', v_prev_hash
  );
  v_hash := encode(pg_catalog.sha256(pg_catalog.convert_to(v_payload::text, 'UTF8')), 'hex');
  insert into public.sim_entities (uid, collection, id, data)
  values (p_uid, 'missions', p_mission->>'id', p_mission);
  update public.sim_companies
     set summary = jsonb_set(summary, '{pendingAlerts}', to_jsonb(coalesce((summary->>'pendingAlerts')::int, 0) + 1)),
         version = version + 1, updated_at = now()
   where uid = p_uid;
  insert into public.sim_audit_events
    (uid, version, request_id, actor_uid, actor_email, action, result, occurred_at, changes, previous_hash, hash)
  values (p_uid, v_version + 1, p_mission->>'id', p_mission->>'teacherUid', '', 'assignMission',
          p_mission->>'id', v_at::timestamptz, v_payload->'changes', v_prev_hash, v_hash);
  return p_mission->>'id';
end;
$$;
revoke execute on function public.sim_add_mission(text, jsonb) from public, anon, authenticated;
grant execute on function public.sim_add_mission(text, jsonb) to service_role;
