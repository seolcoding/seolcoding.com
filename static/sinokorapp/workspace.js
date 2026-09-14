// 개인 작업공간: 이 브라우저 localStorage에 작업공간별 salt·IV·암호문만 저장한다.
// 비밀번호는 화면 입력란에서만 받는다. 파생한 키는 메모리에만 두므로 새로고침·잠금 뒤에는 다시 로그인해야 한다.
(function () {
  'use strict';
  const H = 3600000;
  const PREFIX = 'voyage-workspace:';
  const ITERATIONS = 600000;
  const SAVE_DELAY_MS = 400;
  const MIN_PASSWORD = 8;
  const ID_RULE = /^[\p{L}\p{N}_-]{2,32}$/u;
  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, '0');
  const encoder = new TextEncoder(), decoder = new TextDecoder();

  let app = null, session = null, dirty = false, timer = null, queue = Promise.resolve(), busy = false;

  const appReady = new Promise((resolve) => {
    if (window.VoyageApp?.snapshot) resolve(window.VoyageApp);
    else window.addEventListener('voyage-ready', () => resolve(window.VoyageApp), { once: true });
  });

  function clock(t) {
    const d = new Date(t + 9 * H);
    return `${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  }
  function userError(message) {
    const err = new Error(message);
    err.userMessage = message;
    return err;
  }

  // ---------- 저장 형식 ----------
  function toBase64(bytes) {
    let binary = '';
    const view = new Uint8Array(bytes);
    for (let i = 0; i < view.length; i += 0x8000) binary += String.fromCharCode(...view.subarray(i, i + 0x8000));
    return btoa(binary);
  }
  function fromBase64(text) {
    const binary = atob(text);
    return Uint8Array.from(binary, (c) => c.charCodeAt(0));
  }
  const storageKey = (id) => PREFIX + id;
  const context = (id) => encoder.encode(storageKey(id));

  function listIds() {
    const ids = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) ids.push(key.slice(PREFIX.length));
    }
    return ids.sort();
  }

  function readVault(id) {
    const raw = localStorage.getItem(storageKey(id));
    if (raw === null) throw userError('이 브라우저에 해당 아이디의 작업공간이 없습니다. 아이디를 확인하거나 새 작업공간을 만드세요.');
    try {
      const record = JSON.parse(raw);
      if (![record.salt, record.iv, record.ciphertext].every((x) => typeof x === 'string')) throw new Error('필드 누락');
      return { salt: fromBase64(record.salt), iv: fromBase64(record.iv), ciphertext: fromBase64(record.ciphertext) };
    } catch {
      throw userError('저장된 작업공간 형식을 읽을 수 없습니다. 기록은 바꾸지 않았습니다.');
    }
  }

  async function deriveKey(password, salt) {
    const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  async function sealed(target, payload) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: context(target.id) }, target.key, encoder.encode(payload));
    return JSON.stringify({ salt: toBase64(target.salt), iv: toBase64(iv), ciphertext: toBase64(ciphertext) });
  }
  const payloadOf = (target) => JSON.stringify({ id: target.id, name: target.name, savedAt: new Date().toISOString(), state: target.state });

  // ---------- 저장 순서: 한 번에 하나씩, 항상 최신 상태를 쓴다 ----------
  function setStatus(text, tone = '') {
    const el = $('saveStatus');
    el.textContent = text;
    el.className = `save-status${tone ? ` is-${tone}` : ''}`;
  }

  async function writeLatest(target) {
    if (!dirty || target !== session) return;
    dirty = false;
    setStatus('저장 중…');
    try {
      const record = await sealed(target, payloadOf(target));
      if (target !== session) return;
      localStorage.setItem(storageKey(target.id), record);
      setStatus(`저장됨 ${clock(Date.now())} KST`);
    } catch (err) {
      if (target === session) {
        dirty = true;
        setStatus('저장 실패 · 변경 내용은 화면에 남아 있습니다', 'error');
      }
      throw err;
    }
  }

  function enqueue() {
    const target = session;
    const run = queue.then(() => writeLatest(target));
    queue = run.catch(() => {});
    return run;
  }

  function flush() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!session) return queue;
    return enqueue();
  }

  function onStateChange() {
    if (!session || !app?.active || app.state !== session.state) return;
    dirty = true;
    setStatus('변경 저장 대기');
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      enqueue().catch((err) => console.error(err));
    }, SAVE_DELAY_MS);
  }

  // ---------- 열기 ----------
  function open(info, savedState, message) {
    session = { ...info, state: null };
    dirty = false;
    app.restore(savedState);
    session.state = app.state;
    hideGate();
    $('workspaceUser').textContent = `${info.name} (${info.id})`;
    setStatus(message);
  }

  async function create(id, name, password) {
    const exists = () => localStorage.getItem(storageKey(id)) !== null;
    if (exists()) throw userError('이 브라우저에 이미 있는 아이디입니다. ‘기존 작업공간 로그인’을 선택하세요.');
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const target = { id, name, salt, key: await deriveKey(password, salt), state: app.fresh() };
    const record = await sealed(target, payloadOf(target));
    if (exists()) throw userError('이 브라우저에 이미 있는 아이디입니다. ‘기존 작업공간 로그인’을 선택하세요.');
    localStorage.setItem(storageKey(id), record);
    open(target, target.state, `새 작업공간 · 저장됨 ${clock(Date.now())} KST`);
  }

  // 읽기만 한다. 비밀번호가 틀리면 복호화에서 멈추므로 저장된 기록은 바뀌지 않는다.
  async function login(id, password) {
    const vault = readVault(id);
    const key = await deriveKey(password, vault.salt);
    let plain;
    try {
      plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: vault.iv, additionalData: context(id) }, key, vault.ciphertext);
    } catch {
      throw userError('비밀번호가 맞지 않습니다. 저장된 기록은 바꾸지 않았습니다.');
    }
    let payload;
    try {
      payload = JSON.parse(decoder.decode(plain));
    } catch {
      payload = null;
    }
    if (!payload || payload.id !== id || typeof payload.name !== 'string') throw userError('저장된 작업공간 형식을 읽을 수 없습니다. 기록은 바꾸지 않았습니다.');
    const saved = Date.parse(payload.savedAt);
    open({ id, name: payload.name, salt: vault.salt, key }, payload.state, Number.isFinite(saved) ? `불러옴 · 마지막 저장 ${clock(saved)} KST` : '불러옴');
  }

  // ---------- 로그인 화면 ----------
  const lockTargets = () => document.querySelectorAll('main.workspace, #businessPanel, section.monthly');

  function setMode(mode) {
    const creating = mode === 'create';
    $('workspaceMode').value = mode;
    $('workspaceTitle').textContent = creating ? '새 작업공간 만들기' : '작업공간 로그인';
    $('workspaceNameField').hidden = !creating;
    $('workspaceConfirmField').hidden = !creating;
    $('workspacePassword').autocomplete = creating ? 'new-password' : 'current-password';
    $('workspaceSubmit').textContent = creating ? '작업공간 만들기' : '로그인';
    $('workspaceHint').textContent = creating
      ? '아이디·이름·비밀번호는 직접 정합니다. 비밀번호를 잊으면 이 작업공간의 기록을 열 수 없습니다.'
      : '만들 때 정한 아이디와 비밀번호를 입력하세요.';
    clearError();
  }

  function clearError() {
    $('workspaceError').hidden = true;
    $('workspaceError').textContent = '';
    for (const id of ['workspaceId', 'workspaceName', 'workspacePassword', 'workspaceConfirm']) $(id).removeAttribute('aria-invalid');
  }

  function showError(message, fieldId) {
    $('workspaceError').textContent = message;
    $('workspaceError').hidden = false;
    if (fieldId) {
      $(fieldId).setAttribute('aria-invalid', 'true');
      $(fieldId).focus();
    }
  }

  function clearPasswords() {
    $('workspacePassword').value = '';
    $('workspaceConfirm').value = '';
  }

  function focusFirstEmpty() {
    const creating = $('workspaceMode').value === 'create';
    const order = creating ? ['workspaceId', 'workspaceName', 'workspacePassword'] : ['workspaceId', 'workspacePassword'];
    $(order.find((id) => !$(id).value) || 'workspacePassword').focus();
  }

  function showGate(id) {
    const ids = listIds();
    $('workspaceIds').innerHTML = ids.map((x) => `<option value="${x.replace(/[&<>"']/g, '')}"></option>`).join('');
    setMode(ids.length ? 'login' : 'create');
    $('workspaceId').value = id || (ids.length === 1 ? ids[0] : '');
    $('workspaceName').value = '';
    clearPasswords();
    for (const el of lockTargets()) el.inert = true;
    $('sessionBar').hidden = true;
    $('workspaceGate').hidden = false;
    document.body.classList.add('is-locked');
    focusFirstEmpty();
  }

  function hideGate() {
    clearPasswords();
    clearError();
    $('workspaceGate').hidden = true;
    for (const el of lockTargets()) el.inert = false;
    $('sessionBar').hidden = false;
    document.body.classList.remove('is-locked');
  }

  function problemOf(mode, id, name, password, confirm) {
    if (!ID_RULE.test(id)) return ['아이디는 한글·영문·숫자·_·- 2~32자로 입력하세요.', 'workspaceId'];
    if (mode === 'create' && !name) return ['이름을 입력하세요.', 'workspaceName'];
    if (password.length < MIN_PASSWORD) return [`비밀번호는 ${MIN_PASSWORD}자 이상 입력하세요.`, 'workspacePassword'];
    if (mode === 'create' && password !== confirm) return ['비밀번호 확인이 일치하지 않습니다.', 'workspaceConfirm'];
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    clearError();
    const mode = $('workspaceMode').value;
    const id = $('workspaceId').value.trim();
    const name = $('workspaceName').value.trim();
    const problem = problemOf(mode, id, name, $('workspacePassword').value, $('workspaceConfirm').value);
    if (problem) return showError(...problem);
    if (!window.crypto?.subtle) return showError('이 브라우저 주소에서는 암호화 저장을 사용할 수 없습니다. http://localhost:8766 으로 여세요.');

    busy = true;
    const button = $('workspaceSubmit'), label = button.textContent;
    button.disabled = true;
    button.textContent = mode === 'create' ? '만드는 중…' : '확인 중…';
    $('workspaceForm').setAttribute('aria-busy', 'true');
    try {
      const password = $('workspacePassword').value;
      app = await appReady;
      if (mode === 'create') await create(id, name, password);
      else await login(id, password);
    } catch (err) {
      if (!err.userMessage) console.error(err);
      clearPasswords();
      showError(err.userMessage || '작업공간을 열지 못했습니다. 저장된 기록은 바꾸지 않았습니다.', 'workspacePassword');
    } finally {
      busy = false;
      button.disabled = false;
      if (!session) button.textContent = label;
      $('workspaceForm').removeAttribute('aria-busy');
    }
  }

  async function lockFromButton() {
    const button = $('lockWorkspace');
    button.disabled = true;
    button.textContent = '저장 후 잠그는 중…';
    const ok = await window.VoyageWorkspace.lock();
    button.disabled = false;
    button.textContent = '잠그기';
    if (!ok) setStatus('저장하지 못해 잠그지 않았습니다 · 변경 내용은 화면에 남아 있습니다', 'error');
  }

  // ---------- 연결 ----------
  window.VoyageWorkspace = {
    lock: () => (app ? app.lock() : Promise.resolve(true)),
    get unlocked() { return !!session; },
    flush,
  };

  $('workspaceMode').addEventListener('change', (e) => {
    setMode(e.target.value);
    clearPasswords();
  });
  $('workspaceForm').addEventListener('submit', submit);
  $('lockWorkspace').addEventListener('click', lockFromButton);
  window.addEventListener('voyage-state-change', onStateChange);
  window.addEventListener('voyage-restored', (e) => { if (session) session.state = e.detail.state; });
  window.addEventListener('voyage-locked', () => {
    const id = session?.id;
    clearTimeout(timer);
    timer = null;
    session = null;
    dirty = false;
    setStatus('잠김');
    showGate(id);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && session && (dirty || timer)) flush().catch((err) => console.error(err));
  });
  appReady.then((ready) => { app = ready; });

  showGate();
})();
