-- Empresa virtual de cada estudiante (simulador SAP B1) en Supabase.
-- Aplicada al proyecto b1-academy el 2026-10-06 (migraciones simulador_empresas + simulador_mision_resumen).
-- Mismo modelo que Firestore (perfil + colecciones de entidades) para no tocar el motor del simulador.

create table public.sim_companies (
  uid        text primary key check (uid ~ '^[A-Za-z0-9_-]{1,128}$'),
  email      text,
  profile    jsonb,
  summary    jsonb not null default '{}'::jsonb,
  version    bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sim_entities (
  uid        text not null references public.sim_companies(uid) on delete cascade,
  collection text not null,
  id         text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (uid, collection, id)
);

-- Idempotencia: una misma solicitud (requestId) nunca se aplica dos veces.
create table public.sim_requests (
  uid         text not null references public.sim_companies(uid) on delete cascade,
  request_id  text not null,
  fingerprint text not null,
  action      text not null,
  result      text not null,
  created_at  timestamptz not null default now(),
  primary key (uid, request_id)
);

-- Cerradas al público: solo el servidor (clave secreta / service_role) puede leer y escribir.
alter table public.sim_companies enable row level security;
alter table public.sim_entities  enable row level security;
alter table public.sim_requests  enable row level security;
revoke all on public.sim_companies, public.sim_entities, public.sim_requests from anon, authenticated;

-- Lectura completa de una empresa en UNA consulta.
create or replace function public.sim_read(p_uid text)
returns jsonb language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'exists',   c.uid is not null,
    'version',  coalesce(c.version, 0),
    'profile',  c.profile,
    'entities', coalesce((
      select jsonb_agg(jsonb_build_object('c', e.collection, 'd', e.data))
      from public.sim_entities e where e.uid = p_uid
    ), '[]'::jsonb)
  )
  from (select 1) uno
  left join public.sim_companies c on c.uid = p_uid;
$$;

-- Guardado atómico con control optimista de concurrencia: {status: ok | duplicate | conflict, result}.
create or replace function public.sim_commit(
  p_uid text, p_email text, p_request_id text, p_fingerprint text, p_action text, p_result text,
  p_expected_version bigint, p_profile jsonb, p_summary jsonb, p_upserts jsonb
) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_prev   public.sim_requests;
  v_actual bigint;
begin
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

  insert into public.sim_entities (uid, collection, id, data, updated_at)
  select p_uid, u->>'c', u->>'id', u->'d', now()
  from jsonb_array_elements(coalesce(p_upserts, '[]'::jsonb)) u
  on conflict (uid, collection, id) do update set data = excluded.data, updated_at = now();

  update public.sim_companies
     set version    = version + 1,
         email      = coalesce(p_email, email),
         profile    = coalesce(p_profile, profile),
         summary    = case when p_profile is null then summary else coalesce(p_summary, summary) end,
         updated_at = now()
   where uid = p_uid;

  insert into public.sim_requests (uid, request_id, fingerprint, action, result)
  values (p_uid, p_request_id, p_fingerprint, p_action, p_result);

  return jsonb_build_object('status', 'ok', 'result', p_result);
end;
$$;

-- Misión asignada por un docente (idempotente por id); suma una alerta pendiente al resumen.
create or replace function public.sim_add_mission(p_uid text, p_mission jsonb)
returns text language plpgsql security invoker set search_path = '' as $$
begin
  if not exists (select 1 from public.sim_companies where uid = p_uid and profile is not null) then
    raise exception 'Empresa inexistente.';
  end if;
  insert into public.sim_entities (uid, collection, id, data)
  values (p_uid, 'missions', p_mission->>'id', p_mission)
  on conflict (uid, collection, id) do nothing;
  if found then
    update public.sim_companies
       set summary = jsonb_set(summary, '{pendingAlerts}', to_jsonb(coalesce((summary->>'pendingAlerts')::int, 0) + 1)),
           version = version + 1,
           updated_at = now()
     where uid = p_uid;
  end if;
  return p_mission->>'id';
end;
$$;

revoke execute on function public.sim_read(text) from public, anon, authenticated;
revoke execute on function public.sim_commit(text, text, text, text, text, text, bigint, jsonb, jsonb, jsonb) from public, anon, authenticated;
revoke execute on function public.sim_add_mission(text, jsonb) from public, anon, authenticated;
grant execute on function public.sim_read(text) to service_role;
grant execute on function public.sim_commit(text, text, text, text, text, text, bigint, jsonb, jsonb, jsonb) to service_role;
grant execute on function public.sim_add_mission(text, jsonb) to service_role;
