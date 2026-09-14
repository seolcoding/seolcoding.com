// 작업속도별 고객 영향: 오사카 작업 보고 이후 하역 속도 30/40/60회 조건을 비교하고 부킹별 도착 약속 초과를 보여준다.
// 모든 시각·지연·영향은 VoyageEngine 계산 결과를 그대로 쓴다. 이 파일에서 ETA나 지연을 따로 계산하지 않는다.
(function () {
  'use strict';
  const H = 3600000;
  const RATES = [30, 40, 60];
  const STATUSES = ['미확인', '확인', '진행중', '해결'];
  const PLAYING_INTERVAL_MS = 500;
  const LIMITATIONS = ['입항 예상 기준', '환적·통관·화물 반출 시각 제외'];
  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (t) => { const d = new Date(t + 9 * H); return `${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`; };
  const fmtFull = (t) => { const d = new Date(t + 9 * H); return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`; };
  const isPlainObject = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
  const num = (n) => Number(n).toLocaleString('en-US');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const iso = (t) => new Date(t).toISOString();
  function duration(minutes) {
    const h = Math.floor(minutes / 60), m = minutes % 60;
    return [h ? h + '시간' : '', m ? m + '분' : ''].filter(Boolean).join(' ') || '0분';
  }

  let app, data, engine, by;
  let lastKey = '', lastAt = 0, lastState = null, statusTimer = null;
  // 기록 입력란이 보여주는 작업공간 state·부킹과 저장하지 않은 변경 여부. draftKey는 초안을 만든 조건이다.
  let form = { state: null, bookingId: null, dirty: false, draftKey: null, previous: null };

  // ---------- 계산 결과 모으기 ----------
  // 선택한 속도는 화면 전체가 쓰는 app.snapshot을, 나머지 비교 속도는 같은 엔진으로 같은 시각·시나리오에서 계산한다.
  function snapshotFor(rate) {
    const state = app.state;
    if (rate === state.observedRate) return app.snapshot;
    return engine.calculate({ time: app.snapshot.time, scenarioMode: state.scenarioMode, observedRate: rate });
  }

  function outcome(snap) {
    const call = snap.observedCall;
    const voyage = by.voyageFromCall.get(call.id);
    const destination = voyage && snap.calls.get(voyage.toCallId);
    const affected = snap.bookings.filter((b) => b.impacted);
    return { call, voyage, destination, affected, teu: affected.reduce((n, b) => n + b.teu, 0) };
  }

  function context() {
    const snap = app.snapshot;
    const { call, affected } = outcome(snap);
    const o = call.observed;
    return {
      asOf: iso(snap.time),
      basis: '운항 재생 기준',
      observation: o ? {
        id: o.id, callId: o.callId, portId: call.portId, stage: o.stage, reportedAt: o.reportedAt, reportedBy: o.reportedBy,
        completedMoves: o.completedMoves, totalMoves: call.discharge.moves, reportedRateMovesPerHour: o.rateMovesPerHour,
        normalRateMovesPerHour: o.normalRateMovesPerHour, reason: o.reason,
      } : null,
      calculationCondition: { rateMovesPerHour: call.rate, scenarioMode: app.state.scenarioMode },
      forecast: { departure: iso(call.departure), departureDelayHours: call.delayHours },
      affectedBookings: affected.map((b) => ({
        id: b.id, customer: b.customerName, teu: b.teu, promisedArrival: b.promisedArrival,
        eta: iso(b.eta), lateMinutes: Math.round(b.lateHours * 60), ownerTeam: b.ownerTeam,
      })),
      assumptions: Object.values(data.assumptions || {}),
      limitations: [...LIMITATIONS],
    };
  }

  // ---------- 그리기 ----------
  function setHtml(el, html) {
    if (el.dataset.html === html) return;
    const active = document.activeElement;
    const attr = active && el.contains(active) && ['data-rate', 'data-response', 'data-draft-action'].find((a) => active.hasAttribute(a));
    const value = attr && active.getAttribute(attr);
    el.innerHTML = html;
    el.dataset.html = html;
    if (attr) el.querySelector(`[${attr}="${CSS.escape(value)}"]`)?.focus();
  }

  const late = (delayHours) => delayHours > 0 ? ` <span class="diff-late">+${duration(Math.round(delayHours * 60))}</span>` : '';

  function renderReport(snap) {
    const { call, voyage } = outcome(snap);
    const port = by.ports.get(call.portId).name;
    const observation = data.observations.find((o) => o.callId === call.id);
    const route = voyage && by.routes.get(voyage.routeId);
    $('businessBasis').textContent = `운항 재생 ${fmt(snap.time)} KST 기준 · ${by.ships.get(call.shipId).name} 항차 ${voyage.displayId} ${port} → ${by.ports.get(route.to).name} · 부킹 ${data.bookings.length}건`;
    if (call.observed) {
      const o = call.observed;
      setHtml($('businessReport'), `<div class="notice warn">
        <p><strong>${port} 작업 보고 ${fmt(Date.parse(o.reportedAt))}</strong> · ${esc(o.reportedBy)} · 보고 내용은 그대로 두고 이후 속도만 바꿔 비교합니다.</p>
        <p class="mono">하역 ${num(call.discharge.moves)}회 중 ${num(o.completedMoves)}회 완료 · 보고 속도 ${o.rateMovesPerHour}회/시간 (계획 ${o.normalRateMovesPerHour}회/시간)</p>
        <p>사유: ${esc(o.reason)}</p>
      </div>`);
    } else {
      const note = observation && snap.time < Date.parse(observation.reportedAt)
        ? `${port} 작업 보고(${fmt(Date.parse(observation.reportedAt))}) 전 시각입니다. 보고가 반영되지 않아 세 조건 모두 계획 속도 ${call.discharge.rateMovesPerHour}회/시간으로 계산됩니다.`
        : `반영된 작업 보고가 없어 계획 속도 ${call.discharge.rateMovesPerHour}회/시간으로 계산됩니다.`;
      setHtml($('businessReport'), `<div class="notice"><p>${esc(note)}</p></div>`);
    }
  }

  function renderCards() {
    const state = app.state;
    const reported = app.snapshot.observedCall.observed;
    const html = RATES.map((rate) => {
      const { call, destination, affected, teu } = outcome(snapshotFor(rate));
      const selected = rate === state.observedRate;
      const destName = by.ports.get(destination.portId).name;
      const tags = [
        reported && reported.rateMovesPerHour === rate ? '<span class="badge muted">보고 속도</span>' : '',
        reported && reported.normalRateMovesPerHour === rate ? '<span class="badge muted">계획 속도</span>' : '',
        selected ? '<span class="badge">선택 중</span>' : '',
      ].join(' ');
      return `<article class="impact-card${selected ? ' is-selected' : ''}${affected.length ? ' is-impacted' : ''}" aria-label="이후 하역 ${rate}회/시간 조건">
          <h4>${rate}회/시간 ${tags}</h4>
          <dl>
            <div><dt>하역 완료</dt><dd>${fmt(call.dischargeEnd)}</dd></div>
            <div><dt>출항 예상</dt><dd>${fmt(call.departure)}${late(call.delayHours)}<small>계획 ${fmt(call.plannedMs.departure)}</small></dd></div>
            <div><dt>${esc(destName)} 입항 예상</dt><dd>${fmt(destination.arrival)}${late(destination.arrivalDelayHours)}<small>계획 ${fmt(destination.plannedMs.arrival)}</small></dd></div>
            <div><dt>안내 필요 부킹</dt><dd>${affected.length ? `<span class="badge warn">안내 필요</span> ${affected.length}건 · ${num(teu)}TEU` : '없음 · 0건 · 0TEU'}</dd></div>
          </dl>
          <button type="button" data-rate="${rate}" aria-pressed="${selected}">${selected ? '이 조건으로 보는 중' : `${rate}회/시간으로 보기`}</button>
        </article>`;
    }).join('');
    setHtml($('impactCards'), html);
  }

  function renderBookings(snap) {
    const onlyImpacted = $('impactedOnly').checked;
    const { affected, teu } = outcome(snap);
    const rows = snap.bookings.filter((b) => !onlyImpacted || b.impacted);
    const port = (call) => by.ports.get(call.portId).name;
    const current = conditionKey();
    const html = rows.length ? rows.map((b) => {
      const minutes = Math.round(b.lateHours * 60);
      const record = recordOf(b.id);
      const selected = b.id === form.bookingId;
      const draftState = !record?.draft?.trim() ? '없음' : record.draftKey && record.draftKey !== current ? '<span class="badge warn">조건 변경 · 재확인</span>' : '저장됨';
      return `<tr data-booking="${esc(b.id)}" class="${[b.impacted ? 'is-impacted' : '', selected ? 'is-selected' : ''].join(' ').trim()}">
          <th scope="row"><button type="button" class="link-btn" data-response="${esc(b.id)}" aria-current="${selected}" aria-label="${esc(b.id)} 대응 기록 열기">${esc(b.id)}</button></th>
          <td>${esc(b.customerName)}</td>
          <td>${esc(b.shipId)} · ${esc(port(b.load))} → ${esc(port(b.destination))}</td>
          <td>${esc(b.containerType)} ${num(b.containerCount)}개</td>
          <td class="num">${num(b.teu)}</td>
          <td>${esc(b.ownerTeam)}</td>
          <td class="num">${fmt(Date.parse(b.promisedArrival))}</td>
          <td class="num">${fmt(b.eta)}</td>
          <td class="num">${b.impacted ? `<span class="diff-late">${num(minutes)}분 초과</span>${minutes >= 60 ? ` <small>(${duration(minutes)})</small>` : ''}` : '초과 없음'}</td>
          <td>${b.impacted ? '<span class="badge warn">안내 필요</span>' : '<span class="badge muted">약속 이내</span>'}</td>
          <td>${esc(b.status)}</td>
          <td>${record ? `<span class="badge${record.status === '해결' ? '' : ' muted'}">${esc(statusOf(record))}</span>` : '미확인 · 기록 없음'}</td>
          <td>${draftState}</td>
        </tr>`;
    }).join('') : '<tr><td colspan="13">이 조건에서는 안내가 필요한 부킹이 없습니다. ‘안내 필요만 보기’를 해제하면 전체 부킹을 볼 수 있습니다.</td></tr>';
    setHtml($('bookingRows'), html);
    $('bookingSummary').textContent = `이후 하역 ${snap.observedCall.rate}회/시간 계산 · 안내 필요 ${affected.length}건 · ${num(teu)}TEU · ${onlyImpacted ? `안내 필요 ${rows.length}건만 표시` : `전체 ${data.bookings.length}건 표시`}`;
  }

  function render(force = false) {
    const state = app.state, snap = app.snapshot;
    if (!snap) return;
    const key = [snap.time, state.scenarioMode, state.observedRate, $('impactedOnly').checked].join('|');
    const now = performance.now();
    if (state !== lastState) force = true;
    if (!force && key === lastKey) return;
    if (!force && app.playing && now - lastAt < PLAYING_INTERVAL_MS) return;
    lastKey = key;
    lastAt = now;
    lastState = state;
    if ($('observedRate').value !== String(state.observedRate)) $('observedRate').value = String(state.observedRate);
    if (form.state !== state) {
      loadForm(defaultBookingId(snap));
      setDraftStatus('');
    }
    renderReport(snap);
    renderCards();
    renderBookings(snap);
    renderResponse(snap);
  }

  // ---------- 부킹 대응 기록 ----------
  function recordOf(id) {
    const record = app.state.bookingActions[id];
    return isPlainObject(record) ? record : null;
  }
  const statusOf = (record) => (STATUSES.includes(record?.status) ? record.status : '미확인');

  // 초안이 어느 조건에서 만들어졌는지 비교하기 위한 키: 재생 시각(분 단위)·시나리오·이후 하역 속도
  function conditionKey() {
    return `${Math.floor(app.snapshot.time / 60000) * 60000}|${app.state.scenarioMode}|${app.state.observedRate}`;
  }
  function conditionText(key) {
    const [time, mode, rate] = key.split('|');
    return `운항 재생 ${fmt(Number(time))} KST · 이후 하역 ${rate}회/시간${mode === 'normal' ? ' · 계획 기준' : ''}`;
  }

  function defaultBookingId(snap) {
    return (snap.bookings.find((b) => b.impacted) || snap.bookings[0]).id;
  }

  function setDraftStatus(text, tone = '') {
    const el = $('draftStatus');
    el.textContent = text;
    el.className = `draft-status${tone ? ` is-${tone}` : ''}`;
  }

  function ensureTeamOption(team) {
    const select = $('responseTeam');
    if (team && ![...select.options].some((o) => o.value === team)) select.add(new Option(team, team));
  }

  function loadForm(bookingId) {
    const booking = data.bookings.find((b) => b.id === bookingId);
    const record = recordOf(bookingId);
    const team = typeof record?.team === 'string' && record.team ? record.team : booking.ownerTeam;
    form = { state: app.state, bookingId, dirty: false, draftKey: typeof record?.draftKey === 'string' ? record.draftKey : null, previous: null };
    ensureTeamOption(team);
    $('responseBooking').value = bookingId;
    $('responseTeam').value = team;
    $('responseStatus').value = statusOf(record);
    $('responseNote').value = typeof record?.note === 'string' ? record.note : '';
    $('customerDraft').value = typeof record?.draft === 'string' ? record.draft : '';
    $('undoDraft').hidden = true;
  }

  // 입력란의 값을 선택한 부킹 기록으로 넣는다. 사용자가 고른 대응 상태를 그대로 쓰고, 열람만으로 상태를 바꾸지 않는다.
  function saveForm() {
    if (!app.active || form.state !== app.state) return null;
    const existing = recordOf(form.bookingId) || {};
    const draft = $('customerDraft').value;
    const record = {
      ...existing,
      team: $('responseTeam').value,
      status: STATUSES.includes($('responseStatus').value) ? $('responseStatus').value : '미확인',
      note: $('responseNote').value,
      draft,
      updatedAt: new Date().toISOString(),
    };
    if (draft.trim()) record.draftKey = form.draftKey || conditionKey();
    else delete record.draftKey;
    app.state.bookingActions[form.bookingId] = record;
    form.dirty = false;
    form.draftKey = record.draftKey ?? null;
    form.previous = null;
    $('undoDraft').hidden = true;
    app.changed();
    return record;
  }

  async function saveResponse() {
    const id = form.bookingId;
    const record = saveForm();
    if (!record) return;
    render(true);
    setDraftStatus('저장 중…');
    try {
      await window.VoyageWorkspace?.flush();
      setDraftStatus(`${id} 기록을 저장했습니다 · 대응 상태 ${record.status} · ${fmt(Date.parse(record.updatedAt))} KST`);
    } catch (err) {
      console.error(err);
      setDraftStatus('작업공간에 저장하지 못했습니다. 입력 내용은 화면에 남아 있습니다.', 'error');
    }
  }

  function selectBooking(id) {
    if (!app.active || !data.bookings.some((b) => b.id === id)) return;
    if (id === form.bookingId && form.state === app.state) return;
    const previous = form.bookingId;
    const autoSaved = form.dirty && form.state === app.state && !!saveForm();
    loadForm(id);
    setDraftStatus(`${autoSaved ? `${previous}의 저장하지 않은 변경을 자동 저장했습니다. ` : ''}${id} 기록을 표시합니다.`);
    render(true);
  }

  function markDirty() {
    form.dirty = true;
    setDraftStatus('저장하지 않은 변경이 있습니다.', 'dirty');
    renderDraftCheck();
  }

  // 지연 이유는 엔진이 반영한 작업 보고와 계산 결과에서만 가져온다.
  function delayReason(b, snap) {
    const reported = snap.observedCall, o = reported.observed;
    const fromReport = o && b.shipId === reported.shipId && b.destination.sequence > reported.sequence && b.destination.arrivalDelayHours > 0;
    if (fromReport) {
      return `${by.ports.get(reported.portId).name} 터미널 작업 보고(${fmt(Date.parse(o.reportedAt))} KST) · ${o.reason}. 이후 하역 ${reported.rate}회/시간 조건에서 출항 예상이 ${duration(Math.round(reported.delayHours * 60))} 늦어졌습니다.`;
    }
    if (b.impacted) return '입력된 운항 일정 기준으로 목적항 입항 예상이 도착 약속보다 늦습니다.';
    return '해당 없음 (현재 조건에서 도착 약속 이내 예상)';
  }

  function draftText(bookingId) {
    const snap = app.snapshot;
    const b = snap.bookings.find((x) => x.id === bookingId);
    const reported = snap.observedCall;
    const load = by.ports.get(b.load.portId).name, dest = by.ports.get(b.destination.portId).name;
    const minutes = Math.round(b.lateHours * 60);
    const condition = reported.observed ? `${by.ports.get(reported.portId).name} 이후 하역 ${reported.rate}회/시간 조건` : '작업 보고 반영 전 계획 기준';
    return [
      '[고객 안내 초안 · 발송 전 검토용]',
      `${b.customerName} 담당자님께`,
      '',
      `부킹 ${b.id} 화물의 도착 예상을 안내드립니다.`,
      '',
      `- 고객: ${b.customerName}`,
      `- 부킹: ${b.id} · ${by.ships.get(b.shipId).name} ${load} → ${dest}`,
      `- 물량: ${b.containerType} ${num(b.containerCount)}개 · ${num(b.teu)}TEU`,
      `- 도착 약속: ${fmtFull(Date.parse(b.promisedArrival))} KST`,
      `- 최신 입항 예상: ${fmtFull(b.eta)} KST (${b.impacted ? `약속보다 ${num(minutes)}분 늦음` : '약속 이내'})`,
      `- 지연 이유: ${delayReason(b, snap)}`,
      `- 기준 시각: 운항 재생 ${fmtFull(snap.time)} KST · ${condition}`,
      '',
      `위 시각은 ${dest} 입항 예상 기준이며, 환적·통관·화물 반출 시각은 포함하지 않습니다.`,
      '일정이 다시 바뀌면 추가로 안내드리겠습니다.',
      '',
      `${$('responseTeam').value} 드림`,
    ].join('\n');
  }

  function makeDraft() {
    if (!app.active) return;
    const current = $('customerDraft').value;
    const text = draftText(form.bookingId);
    form.previous = current.trim() && current !== text ? { draft: current, draftKey: form.draftKey } : null;
    $('undoDraft').hidden = !form.previous;
    $('customerDraft').value = text;
    form.draftKey = conditionKey();
    form.dirty = true;
    setDraftStatus(`${form.bookingId} 초안을 현재 조건으로 만들었습니다. 수정한 뒤 ‘기록·초안 저장’을 눌러야 작업공간에 남습니다.${form.previous ? ' 바로 전 초안은 ‘이전 초안 되돌리기’로 복구할 수 있습니다.' : ''}`, 'dirty');
    renderDraftCheck();
  }

  function undoDraft() {
    if (!form.previous) return;
    $('customerDraft').value = form.previous.draft;
    form.draftKey = form.previous.draftKey;
    form.previous = null;
    $('undoDraft').hidden = true;
    markDirty();
    setDraftStatus('이전 초안으로 되돌렸습니다. 저장하지 않은 변경이 있습니다.', 'dirty');
  }

  async function copyDraft() {
    const area = $('customerDraft');
    if (!area.value.trim()) {
      setDraftStatus('복사할 초안이 없습니다. 먼저 ‘현재 조건으로 초안 만들기’를 누르세요.', 'dirty');
      return;
    }
    let copied = false;
    try {
      await navigator.clipboard.writeText(area.value);
      copied = true;
    } catch {
      area.focus();
      area.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
    }
    if (copied) setDraftStatus(`초안을 복사했습니다. 이 화면에서 발송하지 않았습니다.${form.dirty ? ' 변경 내용은 아직 저장하지 않았습니다.' : ''}`);
    else {
      area.focus();
      area.select();
      setDraftStatus('자동 복사를 사용할 수 없습니다. 선택된 초안을 ⌘C 또는 Ctrl+C로 복사하세요.', 'dirty');
    }
  }

  function renderDraftCheck() {
    const el = $('draftCheck');
    const current = conditionKey();
    const stale = !!$('customerDraft').value.trim() && !!form.draftKey && form.draftKey !== current;
    el.hidden = !stale;
    if (!stale) return;
    setHtml(el, `<p><strong>선택 조건이 바뀌었습니다. 초안을 다시 확인하세요.</strong></p>
      <p>초안 기준: ${esc(conditionText(form.draftKey))}<br>현재 조건: ${esc(conditionText(current))}</p>
      <p>입항 예상·약속 초과 분·지연 이유가 달라졌을 수 있습니다. ‘현재 조건으로 초안 만들기’로 다시 만들거나, 직접 확인한 뒤 아래 버튼을 누르세요.</p>
      <button type="button" data-draft-action="confirm">내용 확인함 · 현재 조건 기준으로 표시</button>`);
  }

  function renderResponse(snap) {
    const select = $('responseBooking');
    const options = data.bookings.map((b) => {
      const record = recordOf(b.id);
      return [b.id, `${b.id} · ${b.customerName} · ${b.shipId} ${by.ports.get(snap.calls.get(b.loadCallId).portId).name}→${by.ports.get(snap.calls.get(b.dischargeCallId).portId).name}${record ? ` · ${statusOf(record)}` : ''}`];
    });
    if (select.options.length !== options.length) {
      select.innerHTML = options.map(([id, text]) => `<option value="${esc(id)}">${esc(text)}</option>`).join('');
    } else {
      options.forEach(([, text], i) => { if (select.options[i].textContent !== text) select.options[i].textContent = text; });
    }
    if (select.value !== form.bookingId) select.value = form.bookingId;

    const b = snap.bookings.find((x) => x.id === form.bookingId);
    const minutes = Math.round(b.lateHours * 60);
    const summary = `${b.customerName} · ${b.containerType} ${num(b.containerCount)}개 · ${num(b.teu)}TEU · 도착 약속 ${fmt(Date.parse(b.promisedArrival))} · 입항 예상 ${fmt(b.eta)} · ${b.impacted ? `${num(minutes)}분 초과 · 안내 필요` : '약속 이내'}`;
    if ($('responseSummary').textContent !== summary) $('responseSummary').textContent = summary;
    const record = recordOf(form.bookingId);
    const meta = record
      ? `마지막 저장 ${fmt(Date.parse(record.updatedAt))} KST · 저장된 상태 ${statusOf(record)}`
      : `저장된 기록 없음 · 대응 상태 미확인 · 기본 담당 ${b.ownerTeam}`;
    if ($('responseMeta').textContent !== meta) $('responseMeta').textContent = meta;
    renderDraftCheck();
  }

  // ---------- 조작 ----------
  function showStatus(text) {
    clearTimeout(statusTimer);
    $('businessStatus').textContent = text;
    statusTimer = setTimeout(() => { $('businessStatus').textContent = ''; }, 4000);
  }

  function setRate(rate) {
    if (!app.active || !RATES.includes(rate) || app.state.observedRate === rate) return;
    app.state.observedRate = rate;
    app.changed();
    app.renderDynamic();
  }

  function reset() {
    if (!app.active) return;
    app.pause?.(false);
    const state = app.state;
    state.time = Date.parse(data.replay.initial);
    state.scenarioMode = 'delay';
    state.observedRate = 30;
    app.selectVoyage('OP-S06-02');
    showStatus(`${fmt(state.time)} KST · S06 · 30회/시간으로 복원했습니다.`);
  }

  function init() {
    app = window.VoyageApp;
    data = app.data;
    engine = globalThis.VoyageEngine.create(data);
    by = {
      ships: new Map(data.ships.map((x) => [x.id, x])),
      ports: new Map(data.ports.map((x) => [x.id, x])),
      routes: new Map(data.routes.map((x) => [x.id, x])),
      voyageFromCall: new Map(data.voyages.map((v) => [v.fromCallId, v])),
    };

    window.VoyageBusiness = { context };

    $('businessLimits').textContent = `안내 기준: ${LIMITATIONS.join(' · ')}. 부킹의 고객 도착 약속을 목적항 입항 예상과 비교합니다.`;
    $('observedRate').addEventListener('change', (e) => setRate(Number(e.target.value)));
    $('impactCards').addEventListener('click', (e) => {
      const button = e.target.closest('[data-rate]');
      if (button) setRate(Number(button.dataset.rate));
    });
    $('impactedOnly').addEventListener('change', () => render(true));
    $('businessReset').addEventListener('click', reset);

    $('responseTeam').innerHTML = [...new Set([...data.bookings.map((b) => b.ownerTeam), '운항 담당'])].map((team) => `<option value="${esc(team)}">${esc(team)}</option>`).join('');
    $('bookingRows').addEventListener('click', (e) => {
      const button = e.target.closest('[data-response]');
      if (!button) return;
      selectBooking(button.dataset.response);
      $('responsePanel').scrollIntoView({ block: 'nearest' });
      $('responseBooking').focus({ preventScroll: true });
    });
    $('responseBooking').addEventListener('change', (e) => selectBooking(e.target.value));
    $('responseTeam').addEventListener('change', markDirty);
    $('responseStatus').addEventListener('change', markDirty);
    $('responseNote').addEventListener('input', markDirty);
    $('customerDraft').addEventListener('input', markDirty);
    $('makeDraft').addEventListener('click', makeDraft);
    $('undoDraft').addEventListener('click', undoDraft);
    $('copyDraft').addEventListener('click', copyDraft);
    $('saveResponse').addEventListener('click', saveResponse);
    $('draftCheck').addEventListener('click', (e) => {
      if (!e.target.closest('[data-draft-action="confirm"]')) return;
      form.draftKey = conditionKey();
      markDirty();
      setDraftStatus('현재 조건 기준으로 확인했다고 표시했습니다. ‘기록·초안 저장’을 눌러야 작업공간에 남습니다.', 'dirty');
      $('saveResponse').focus();
    });
    // 잠그기 버튼의 저장·잠금보다 먼저 실행해, 저장하지 않은 기록 입력을 작업공간 저장에 포함한다.
    document.addEventListener('click', (e) => {
      if (e.target.closest('#lockWorkspace') && form.dirty && form.state === app.state && app.active) saveForm();
    }, true);
    window.addEventListener('voyage-ships-render', () => render());
    window.addEventListener('voyage-playback-change', () => render(true));
    window.addEventListener('voyage-locked', () => {
      $('impactedOnly').checked = false;
      $('businessStatus').textContent = '';
      render(true);
    });
    render(true);
  }

  if (window.VoyageApp?.snapshot) init();
  else window.addEventListener('voyage-ready', init, { once: true });
})();
