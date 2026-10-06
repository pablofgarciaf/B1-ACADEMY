// Install the isolated test runtime (no change to the app dependencies):
// npm install --prefix "$env:TEMP/sap-aula-regression" react@19.0.0 react-test-renderer@19.0.0 --ignore-scripts
// Run: node tests/aula-flow.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const ts = require('typescript');
const runtime = createRequire(path.join(process.env.SAP_TEST_RUNTIME || path.join(os.tmpdir(), 'sap-aula-regression'), 'package.json'));
const React = runtime('react');
const { create, act } = runtime('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT = true;
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
const flush = () => act(async () => { await new Promise(resolve => setImmediate(resolve)); });

function clock() {
  let now = 0, id = 0;
  const timers = new Map();
  return {
    setTimeout(fn, delay) { const key = ++id; timers.set(key, { fn, at: now + delay }); return key; },
    clearTimeout(key) { timers.delete(key); },
    async advance(ms) {
      const target = now + ms;
      while (true) {
        const next = [...timers].filter(([, t]) => t.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        now = next[1].at; timers.delete(next[0]);
        await act(async () => { await next[1].fn(); });
        await flush();
      }
      now = target;
    },
  };
}

function load(file, mocks, globals = {}) {
  const filename = path.resolve(__dirname, '..', file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(source, {
    module: mod, exports: mod.exports, console, AbortController, DOMException,
    require(name) {
      if (name === 'react' || name === 'react/jsx-runtime') return runtime(name);
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name === 'lucide-react') return new Proxy({}, { get: (_, key) => String(key) });
      throw new Error(`Unmocked dependency: ${name}`);
    },
    ...globals,
  }, { filename });
  return module.exports;
}

async function aula({ failSave = false } = {}) {
  const timer = clock();
  const calls = [], pending = new Map(), writes = [];
  const voice = { isSpeaking: false, isMuted: false, needsGesture: false, stopSpeaking() {}, preload() {}, toggleMute() {}, resumeAfterGesture() {}, speakText(text, end) { calls.push({ text, end }); } };
  const auth = { currentUser: { getIdToken: async () => 'test-token' }, userProfile: { name: 'Test' } };
  const classes = ['a', 'b', 'c'].map((id, index) => ({ id, title: `Class ${id}`, number: index + 1, durationMinutes: 1 }));
  const Page = load('src/app/mi-aula/[moduleId]/page.tsx', {
    'next/link': 'a', 'next/image': 'img', '@/context/AuthContext': { useAuth: () => auth },
    '@/hooks/useAcademyVoice': { useAcademyVoice: () => voice },
    '@/lib/curriculum-data': { OFFICIAL_SYLLABUS: [{ id: 'mod-1', title: 'Test module', number: 1, classes }] },
    '@/components/simulator/SAPInteractiveSimulator': 'simulator',
  }, {
    ...timer, window: { matchMedia: () => ({ matches: true }) },
    fetch: async (url, options) => {
      if (url.startsWith('/api/lesson-data')) {
        const id = new URL(url, 'http://test').searchParams.get('classId');
        const request = deferred(); pending.set(id, request); return request.promise;
      }
      if (options?.method === 'POST') { writes.push(JSON.parse(options.body)); return { ok: !failSave }; }
      return { ok: true, json: async () => ({ completedClasses: [] }) };
    },
  }).default;
  let tree;
  await act(async () => { tree = create(React.createElement(Page, { params: Promise.resolve({ moduleId: 'mod-1' }) })); });
  await flush();
  return {
    tree, calls, writes, timer,
    async lesson(id) { await act(async () => pending.get(id).resolve({ ok: true, json: async () => ({ classId: id, title: `Class ${id}`, images: [], totalSlides: 1, syncData: [{ slide_index: 1, script_text: `Narration ${id}`, step_guide: null }] }) })); await flush(); },
    async select(id) { const button = tree.root.findAllByType('button').find(node => node.findAllByType('p').some(p => p.children.join('') === `Class ${id}`)); await act(async () => button.props.onClick()); await flush(); },
    async end() { await act(async () => calls.at(-1).end()); },
    async close() { await act(async () => tree.unmount()); },
  };
}

test('automatic transition never narrates the previous class while the next request is pending', async () => {
  const app = await aula();
  try {
    await app.lesson('a'); await app.end(); await app.timer.advance(2700);
    assert.deepEqual(app.calls.map(call => call.text), ['Narration a']);
    assert.deepEqual(app.writes, [{ moduleId: 'mod-1', classId: 'a' }]);
    await app.lesson('b');
    assert.deepEqual(app.calls.map(call => call.text), ['Narration a', 'Narration b']);
  } finally { await app.close(); }
});

test('manual navigation cancels a pending automatic advance and ignores an old load response', async () => {
  const app = await aula();
  try {
    await app.lesson('a'); await app.end(); await app.timer.advance(1200);
    await app.select('b'); await app.select('c'); await app.lesson('c'); await app.lesson('b');
    await app.timer.advance(5000);
    assert.deepEqual(app.calls.map(call => call.text), ['Narration a', 'Narration c']);
  } finally { await app.close(); }
});

test('a failed progress save reports failure and does not advance', async () => {
  const app = await aula({ failSave: true });
  try {
    await app.lesson('a'); await app.end(); await app.timer.advance(5000);
    assert.equal(app.tree.root.findAllByProps({ role: 'status' })[0].children.join(''), 'No se pudo guardar el progreso. Reintenta para continuar.');
    assert.deepEqual(app.calls.map(call => call.text), ['Narration a']);
  } finally { await app.close(); }
});

test('voice ignores stale requests and play failures; mute preserves progress and completion runs once', async () => {
  const requests = [], audios = [], plays = [];
  const timer = clock();
  const { useAcademyVoice } = load('src/hooks/useAcademyVoice.ts', {}, {
    ...timer,
    fetch: () => { const request = deferred(); requests.push(request); return request.promise; },
    URL: { createObjectURL: blob => blob },
    Audio: class { constructor() { audios.push(this); } pause() {} play() { const play = deferred(); plays.push(play); return play.promise; } },
  });
  let voice, tree, ends = 0;
  function Probe() { voice = useAcademyVoice(); return null; }
  await act(async () => { tree = create(React.createElement(Probe)); });
  try {
    await act(async () => voice.speakText('old pending'));
    await act(async () => voice.speakText('current'));
    await act(async () => requests[0].resolve({ ok: true, blob: async () => 'old' }));
    assert.equal(audios.length, 0);
    await act(async () => voice.toggleMute());
    await act(async () => requests[1].resolve({ ok: true, blob: async () => 'current' }));
    assert.equal(audios[0].muted, true);
    await act(async () => voice.speakText('next', () => { ends++; }));
    await act(async () => plays[0].reject(new DOMException('blocked', 'NotAllowedError')));
    assert.equal(voice.needsGesture, false);
    await act(async () => requests[2].resolve({ ok: true, blob: async () => 'next' }));
    const end = audios[0].onended;
    await act(async () => { voice.toggleMute(); });
    assert.equal(ends, 0);
    assert.equal(audios[0].muted, false);
    await act(async () => { end(); end(); });
    assert.equal(ends, 1);
  } finally { await act(async () => tree.unmount()); }
});

test('restarting the first slide starts its narration again only after reloading its data', async () => {
  const app = await aula();
  try {
    await app.lesson('a');
    await act(async () => app.tree.root.findByProps({ title: 'Reiniciar clase' }).props.onClick());
    assert.equal(app.calls.length, 1);
    await app.lesson('a');
    assert.deepEqual(app.calls.map(call => call.text), ['Narration a', 'Narration a']);
  } finally { await app.close(); }
});

async function simulator() {
  const timer = clock();
  let completions = 0, tree;
  const Simulator = load('src/components/simulator/SAPInteractiveSimulator.tsx', {
    'next/link': 'a', '@/context/AuthContext': { useAuth: () => ({ userProfile: null }) },
    '@/lib/firebase': { db: {} }, 'firebase/firestore': {},
    '@/lib/manual-simulator-registry': { getManualSimulatorConfig: () => ({ archetype: 'cockpit', requiresSimulator: true }) },
    '@/lib/erp/erp-database-service': {}, './GuidedOverlay': 'overlay',
    '@/components/sap-screens/SAPScreenRenderer': 'screen',
  }, { ...timer, localStorage: { getItem: () => null, setItem() {} } }).default;
  await act(async () => {
    tree = create(React.createElement(Simulator, {
      manualId: 'mod1-c2', currentStepIndex: 1,
      stepGuide: { action_type: 'cockpit', title: 'Configurar Perfil de Usuario', instructions: [] },
      onMissionComplete: () => { completions++; },
    }));
  });
  return { tree, timer, get completions() { return completions; },
    save: () => act(async () => tree.root.findAllByType('button').find(button => button.children.includes('Actualizar y Guardar')).props.onClick()),
    selectWarehouse: () => act(async () => tree.root.findAllByType('select').find(select => select.props.value === '01 - Almacén Central').props.onChange({ target: { value: '02 - Almacén Logístico Norte' } })),
    close: () => act(async () => tree.unmount()),
  };
}

test('preferences cannot be completed through alerts or by saving the wrong warehouse; correct save completes once', async () => {
  const app = await simulator();
  try {
    await act(async () => app.tree.root.findByProps({ title: 'Mensajes y Alertas' }).props.onClick());
    await act(async () => app.tree.root.findAllByType('button').find(button => button.children.includes('Cerrar')).props.onClick());
    await app.timer.advance(1500);
    assert.equal(app.completions, 0);
    await app.save(); await app.timer.advance(1500);
    assert.equal(app.completions, 0);
    await app.selectWarehouse(); await app.save(); await app.save(); await app.timer.advance(1500);
    assert.equal(app.completions, 1);
  } finally { await app.close(); }
});

test('leaving the simulator cancels its pending mission completion', async () => {
  const app = await simulator();
  await app.selectWarehouse(); await app.save(); await app.close(); await app.timer.advance(5000);
  assert.equal(app.completions, 0);
});
