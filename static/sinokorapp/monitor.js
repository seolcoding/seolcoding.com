// 선택 선박의 현재 작업 그림과 운항 소식. VoyageApp.snapshot의 계산 결과만 표시한다.
(function () {
  'use strict';
  const H = 3600000;
  const SLOTS = 12;
  const TRIP_REAL_SECONDS = 1.6;
  const NEWS_LIMIT = 12;
  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, '0');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (t) => { const d = new Date(t + 9 * H); return `${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`; };
  const num = (n) => Number(n).toLocaleString('en-US');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let app, refs, lastNewsHtml = '', newsPointerHeld = false;

  // ---------- 작업 그림 ----------
  const SHIP_SLOT = (i) => ({ x: 30 + (i % 6) * 22, y: 66 - Math.floor(i / 6) * 14 });
  const QUAY_SLOT = (i) => ({ x: 214 + (i % 6) * 17, y: 71 - Math.floor(i / 6) * 14 });
  const BOOM_Y = 30;

  function build() {
    const shipSlots = Array.from({ length: SLOTS }, (_, i) => { const p = SHIP_SLOT(i); return `<rect class="slot" x="${p.x}" y="${p.y}" width="20" height="12" rx="1"/>`; }).join('');
    const quaySlots = Array.from({ length: SLOTS }, (_, i) => { const p = QUAY_SLOT(i); return `<rect class="slot" x="${p.x}" y="${p.y}" width="15" height="12" rx="1"/>`; }).join('');
    $('workMonitor').innerHTML = `
      <h3 id="workTitle">현재 작업</h3>
      <p id="workStatus" class="work-status"></p>
      <figure class="work-figure" id="workFigure">
        <svg class="work-scene" viewBox="0 0 320 120" role="img" aria-labelledby="workSceneText">
          <title id="workSceneText">작업 그림</title>
          <rect class="water" x="0" y="84" width="196" height="36"/>
          <rect class="quay" x="196" y="84" width="124" height="36"/>
          <polygon class="hull" points="12,80 176,80 164,108 26,108"/>
          <line class="crane" x1="200" y1="${BOOM_Y - 12}" x2="200" y2="84"/>
          <line class="crane" x1="20" y1="${BOOM_Y - 12}" x2="316" y2="${BOOM_Y - 12}"/>
          <g id="shipSlots">${shipSlots}</g>
          <g id="quaySlots">${quaySlots}</g>
          <line id="spreader" class="spreader" x1="0" y1="${BOOM_Y - 12}" x2="0" y2="${BOOM_Y}"/>
          <rect id="movingBox" class="box moving" x="0" y="0" width="18" height="12" rx="1"/>
          <text class="scene-label" x="94" y="118" text-anchor="middle">배</text>
          <text class="scene-label" x="258" y="118" text-anchor="middle">부두</text>
        </svg>
        <figcaption><span id="workDirection"></span> · 상자 수는 진행을 나타내는 그림입니다.</figcaption>
      </figure>
      <div class="work-metrics">
        <div class="metric" id="dischargeMetric">
          <span class="metric-label">하역 작업 회수</span>
          <strong class="mono" id="dischargeMoves"></strong>
          <div class="progress" role="progressbar" aria-label="하역 진행률" aria-valuemin="0" aria-valuemax="100"><span></span></div>
        </div>
        <div class="metric" id="loadMetric">
          <span class="metric-label">선적 작업 회수</span>
          <strong class="mono" id="loadMoves"></strong>
          <div class="progress" role="progressbar" aria-label="선적 진행률" aria-valuemin="0" aria-valuemax="100"><span></span></div>
        </div>
      </div>
      <dl class="work-teu">
        <div><dt>하역 물량</dt><dd id="dischargeTeu" class="mono"></dd></div>
        <div><dt>선적 물량</dt><dd id="loadTeu" class="mono"></dd></div>
      </dl>
      <dl class="facts" id="workForecast"></dl>`;
    refs = {
      shipSlots: [...$('shipSlots').children],
      quaySlots: [...$('quaySlots').children],
      box: $('movingBox'),
      spreader: $('spreader'),
    };
  }

  function setText(el, text) {
    if (el.textContent !== text) el.textContent = text;
  }

  function fillSlots(slots, count, cargo) {
    slots.forEach((slot, i) => slot.setAttribute('class', i < count ? `box ${cargo}` : 'slot'));
  }

  function setProgress(metric, done, moves) {
    const pct = moves ? Math.floor(done / moves * 100) : 0;
    const bar = metric.querySelector('.progress');
    bar.firstElementChild.style.width = `${pct}%`;
    bar.setAttribute('aria-valuenow', String(pct));
    return pct;
  }

  // 컨테이너 한 번의 이동 위치는 재생 시각으로 정한다. 정지하면 시각이 멈추므로 그림도 멈춘다.
  function moveBox(stage, time) {
    const tripMs = TRIP_REAL_SECONDS * app.data.replay.minutesPerSecondAt1x * 60000 * app.state.speed;
    const phase = ((time % tripMs) + tripMs) % tripMs / tripMs;
    const shipPoint = { x: 85, y: 52 }, quayPoint = { x: 256, y: 57 };
    const [from, to] = stage === 'discharge' ? [shipPoint, quayPoint] : [quayPoint, shipPoint];
    let x, y;
    if (phase < 0.2) { x = from.x; y = from.y + (BOOM_Y - from.y) * (phase / 0.2); }
    else if (phase < 0.8) { x = from.x + (to.x - from.x) * ((phase - 0.2) / 0.6); y = BOOM_Y; }
    else { x = to.x; y = BOOM_Y + (to.y - BOOM_Y) * ((phase - 0.8) / 0.2); }
    refs.box.setAttribute('x', (x - 9).toFixed(1));
    refs.box.setAttribute('y', y.toFixed(1));
    refs.box.setAttribute('class', `box moving ${stage === 'discharge' ? 'import' : 'export'}`);
    refs.spreader.setAttribute('x1', x.toFixed(1));
    refs.spreader.setAttribute('x2', x.toFixed(1));
    refs.spreader.setAttribute('y2', y.toFixed(1));
  }

  function selectedShipId() {
    const state = app.state;
    if (state.selectedPortId) return null;
    return app.data.voyages.find((v) => v.id === state.selectedVoyageId)?.shipId ?? null;
  }

  function renderWork() {
    const monitor = $('workMonitor');
    const shipId = selectedShipId();
    if (!shipId) { monitor.hidden = true; return; }
    monitor.hidden = false;

    const snap = app.snapshot, t = snap.time;
    const s = snap.ships.get(shipId);
    const call = s.moving ? snap.calls.get(s.moving.toCallId) : s.call;
    const port = app.data.ports.find((p) => p.id === call.portId).name;
    const outgoing = app.data.voyages.find((v) => v.fromCallId === call.id);
    const atPort = !s.moving && t >= call.arrival;

    setText($('workTitle'), `${s.ship.name} 현재 작업 · ${port}`);
    const statusText = s.moving
      ? `운항 중 · ${port} 입항 예상 ${fmt(s.moving.arrival)} · 도착 후 작업 예정`
      : `${s.status} · ${call.terminalName}`;
    setText($('workStatus'), statusText);

    const dDone = Math.floor(call.dischargeDone), dMoves = call.discharge.moves;
    const lDone = Math.floor(call.loadDone), lMoves = call.load.moves;
    const dPct = setProgress($('dischargeMetric'), dDone, dMoves);
    const lPct = setProgress($('loadMetric'), lDone, lMoves);
    setText($('dischargeMoves'), `${num(dDone)}/${num(dMoves)}회 · ${dPct}%`);
    setText($('loadMoves'), `${num(lDone)}/${num(lMoves)}회 · ${lPct}%`);
    $('dischargeMetric').classList.toggle('is-active', s.stage === 'discharge');
    $('loadMetric').classList.toggle('is-active', s.stage === 'load');
    const teu = (q) => `${num(q.teu)}TEU · 20GP ${num(q.containers['20GP'])}개 + 40HC ${num(q.containers['40HC'])}개`;
    setText($('dischargeTeu'), teu(call.discharge));
    setText($('loadTeu'), teu(call.load));

    const figure = $('workFigure');
    figure.hidden = !atPort;
    if (atPort) {
      let shipCount, quayCount, cargo, direction;
      if (t < call.loadStart) {
        shipCount = Math.round((1 - call.dischargeDone / dMoves) * SLOTS);
        quayCount = SLOTS - shipCount;
        cargo = 'import';
        direction = s.stage === 'discharge' ? '하역: 배 → 부두' : '하역 대기';
      } else {
        shipCount = Math.round(call.loadDone / lMoves * SLOTS);
        quayCount = SLOTS - shipCount;
        cargo = 'export';
        direction = s.stage === 'load' ? '선적: 부두 → 배' : '선적 완료';
      }
      fillSlots(refs.shipSlots, shipCount, cargo);
      fillSlots(refs.quaySlots, quayCount, cargo);
      setText($('workDirection'), direction);
      const moving = !!s.stage && !reducedMotion;
      refs.box.style.display = moving ? '' : 'none';
      refs.spreader.style.display = moving ? '' : 'none';
      if (moving) moveBox(s.stage, t);
      setText($('workSceneText'), `${direction}. 배 쪽 상자 ${shipCount}개, 부두 쪽 상자 ${quayCount}개로 진행을 표시`);
    }

    const rows = [
      ['하역 완료 예상', fmt(call.dischargeEnd)],
      ['선적 완료 예상', fmt(call.loadEnd)],
      ['출항 준비 예상', outgoing ? fmt(call.ready) : '다음 일정 미등록'],
      ['다음 운항', outgoing ? `${outgoing.displayId} · 출항 ${fmt(snap.legs.get(outgoing.id).departure)}` : '다음 일정 미등록'],
    ];
    const html = rows.map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
    if ($('workForecast').dataset.html !== html) {
      $('workForecast').innerHTML = html;
      $('workForecast').dataset.html = html;
    }
  }

  // ---------- 운항 소식 ----------
  function renderNews() {
    if (newsPointerHeld) return;
    const events = app.snapshot.events.slice(0, NEWS_LIMIT);
    const html = events.length
      ? events.map((e) => `<li><button type="button" class="news-item${e.tone === 'warn' ? ' is-warn' : ''}" data-news="${esc(e.id)}">
          <time class="mono">${fmt(e.at)}</time>${e.tone === 'warn' ? '<span class="badge warn">주의</span>' : ''}<span>${esc(e.title)}</span></button></li>`).join('')
      : '<li class="news-empty">이 시각까지 등록된 소식이 없습니다.</li>';
    if (html === lastNewsHtml) return;
    const focused = document.activeElement?.dataset?.news;
    $('newsList').innerHTML = html;
    lastNewsHtml = html;
    if (focused) $('newsList').querySelector(`[data-news="${CSS.escape(focused)}"]`)?.focus();
    window.dispatchEvent(new CustomEvent('voyage-alerts-render', { detail: { events } }));
  }

  function relatedVoyage(event) {
    const observation = app.data.observations.find((o) => o.id === event.id);
    const [callId, field] = observation ? [observation.callId, 'observation'] : event.id.split(':');
    const outgoing = app.data.voyages.find((v) => v.fromCallId === callId);
    const incoming = app.data.voyages.find((v) => v.toCallId === callId);
    return field === 'arrival' || field === 'berth' ? (incoming || outgoing) : (outgoing || incoming);
  }

  function openNews(id) {
    const event = app.snapshot.events.find((e) => e.id === id);
    const voyage = event && relatedVoyage(event);
    if (!voyage) return;
    app.selectVoyage(voyage.id);
    if ($('detailBody').hidden) $('detailToggle').click();
    $('detailTitle').focus({ preventScroll: true });
    $('detailTitle').scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function render() {
    renderWork();
    renderNews();
  }

  function init() {
    app = window.VoyageApp;
    build();
    $('newsList').addEventListener('pointerdown', () => { newsPointerHeld = true; });
    document.addEventListener('pointerup', () => {
      if (!newsPointerHeld) return;
      newsPointerHeld = false;
      requestAnimationFrame(renderNews);
    }, true);
    $('newsList').addEventListener('click', (e) => {
      const button = e.target.closest('[data-news]');
      if (button) openNews(button.dataset.news);
    });
    window.addEventListener('voyage-ships-render', render);
    render();
  }

  if (window.VoyageApp?.snapshot) init();
  else window.addEventListener('voyage-ready', init, { once: true });
})();
