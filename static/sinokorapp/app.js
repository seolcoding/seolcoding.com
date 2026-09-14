// 지도·선박 목록·상세·참고 월간 실적 화면. 계산은 engine.js의 VoyageEngine만 사용한다.
(function () {
  'use strict';
  const H = 3600000;
  const $ = (id) => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STAGES = [['arrival', '입항'], ['berth', '접안'], ['dischargeEnd', '하역 완료'], ['loadEnd', '선적 완료'], ['ready', '출항 준비'], ['departure', '출항']];
  const SHIP_SVG = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 0 L12 13 L7 10 L2 13 Z"/></svg>';

  let data, engine, state, snapshot, map;
  const by = {};
  const layers = { routes: new Map(), ports: new Map(), ships: new Map() };
  let rendering = false;
  let active = false, locking = null;

  // ---------- 표시 형식 (모두 KST) ----------
  const pad = (n) => String(n).padStart(2, '0');
  function kstParts(t) {
    const d = new Date(t + 9 * H);
    return { y: d.getUTCFullYear(), mo: pad(d.getUTCMonth() + 1), d: pad(d.getUTCDate()), h: pad(d.getUTCHours()), mi: pad(d.getUTCMinutes()) };
  }
  const fmt = (t) => { const p = kstParts(t); return `${p.mo}/${p.d} ${p.h}:${p.mi}`; };
  const fmtFull = (t) => { const p = kstParts(t); return `${p.y}-${p.mo}-${p.d} ${p.h}:${p.mi}`; };
  const fmtDate = (t) => { const p = kstParts(t); return `${p.y}-${p.mo}-${p.d}`; };
  const num = (n) => Number(n).toLocaleString('en-US');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function duration(minutes) {
    const h = Math.floor(minutes / 60), m = minutes % 60;
    return [h ? h + '시간' : '', m ? m + '분' : ''].filter(Boolean).join(' ') || '0분';
  }
  function diffText(ms) {
    const minutes = Math.round(ms / 60000);
    if (minutes === 0) return '<span class="diff-ok">계획대로</span>';
    return minutes > 0 ? `<span class="diff-late">+${duration(minutes)} 늦음</span>` : `<span class="diff-ok">${duration(-minutes)} 빠름</span>`;
  }

  // ---------- 상태 ----------
  function fresh() {
    return {
      modelVersion: 4,
      time: Date.parse(data.replay.initial),
      speed: data.replay.speeds[0],
      selectedVoyageId: 'OP-S06-02',
      selectedPortId: null,
      route: 'all',
      watchShips: [],
      notes: {},
      alertAck: {},
      watchOnly: false,
      tickerPaused: false,
      followShipId: null,
      scenarioMode: 'delay',
      observedRate: 30,
      bookingActions: {},
    };
  }
  function changed() {
    window.dispatchEvent(new CustomEvent('voyage-state-change', { detail: { state } }));
  }
  function calculate() {
    snapshot = engine.calculate({ time: state.time, scenarioMode: state.scenarioMode, observedRate: state.observedRate });
    return snapshot;
  }

  // 저장본을 기본 상태 위에 덮고, 알고 있는 필드만 형식을 검사한다. 모르는 확장 필드는 그대로 둔다.
  const isPlainObject = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
  function validated(saved) {
    const base = fresh();
    const next = { ...base, ...(isPlainObject(saved) ? saved : {}) };
    const start = Date.parse(data.replay.start), end = Date.parse(data.replay.end);
    next.modelVersion = 4;
    if (typeof next.time !== 'number' || !Number.isFinite(next.time) || next.time < start || next.time > end) next.time = base.time;
    if (!data.replay.speeds.includes(next.speed)) next.speed = base.speed;
    if (!by.voyages.has(next.selectedVoyageId)) next.selectedVoyageId = base.selectedVoyageId;
    if (!by.ports.has(next.selectedPortId)) next.selectedPortId = null;
    if (next.route !== 'all' && !by.historicalRoutes.has(next.route)) next.route = 'all';
    next.watchShips = Array.isArray(next.watchShips) ? [...new Set(next.watchShips.filter((id) => by.ships.has(id)))] : [];
    next.notes = isPlainObject(next.notes) ? Object.fromEntries(Object.entries(next.notes).filter(([, text]) => typeof text === 'string')) : {};
    next.alertAck = isPlainObject(next.alertAck) ? { ...next.alertAck } : {};
    next.bookingActions = isPlainObject(next.bookingActions) ? Object.fromEntries(Object.entries(next.bookingActions).filter(([, record]) => isPlainObject(record))) : {};
    next.watchOnly = next.watchOnly === true;
    next.tickerPaused = next.tickerPaused === true;
    if (!by.ships.has(next.followShipId)) next.followShipId = null;
    if (!['delay', 'normal'].includes(next.scenarioMode)) next.scenarioMode = base.scenarioMode;
    if (![30, 40, 60].includes(next.observedRate)) next.observedRate = base.observedRate;
    if ('scenarioKey' in next && typeof next.scenarioKey !== 'string') delete next.scenarioKey;
    return next;
  }

  // 작업공간을 열 때 한 번 호출한다. 재생은 항상 정지 상태로 복원한다.
  function restore(saved) {
    window.VoyageApp.pause?.(false);
    state = validated(saved);
    active = true;
    lastPanelKey = '';
    renderDynamic();
    renderMonthly();
    window.dispatchEvent(new CustomEvent('voyage-restored', { detail: { state } }));
    return state;
  }

  // 작성 중인 메모를 넣고 재생을 멈춘 뒤, 작업공간 저장이 끝나야 기본 상태로 비운다.
  // 저장에 실패하면 잠그지 않고 false를 돌려주며 화면의 상태를 그대로 둔다.
  function lock() {
    if (locking) return locking;
    locking = (async () => {
      if (!active) return true;
      commitNoteDraft();
      window.VoyageApp.pause?.(true);
      if (window.VoyageWorkspace?.unlocked) {
        try {
          await window.VoyageWorkspace.flush();
        } catch (err) {
          console.error(err);
          return false;
        }
      }
      state = fresh();
      active = false;
      noteNotice = '';
      lastPanelKey = '';
      renderDynamic();
      renderMonthly();
      window.dispatchEvent(new CustomEvent('voyage-locked', { detail: { state } }));
      return true;
    })().finally(() => { locking = null; });
    return locking;
  }

  // ---------- 위치: 계산된 운항 구간과 시각 비율로 항로 위를 보간 ----------
  function segmentLength(a, b) {
    const k = Math.cos(((a[0] + b[0]) / 2) * Math.PI / 180);
    return Math.hypot((b[1] - a[1]) * k, b[0] - a[0]);
  }
  function bearing(a, b) {
    const k = Math.cos(((a[0] + b[0]) / 2) * Math.PI / 180);
    return (Math.atan2((b[1] - a[1]) * k, b[0] - a[0]) * 180 / Math.PI + 360) % 360;
  }
  function pointOnPath(path, fraction) {
    const lengths = path.slice(1).map((p, i) => segmentLength(path[i], p));
    let remaining = lengths.reduce((a, b) => a + b, 0) * fraction;
    for (let i = 0; i < lengths.length; i++) {
      if (remaining <= lengths[i] || i === lengths.length - 1) {
        const r = lengths[i] ? Math.min(1, remaining / lengths[i]) : 0;
        const a = path[i], b = path[i + 1];
        return { lat: a[0] + (b[0] - a[0]) * r, lng: a[1] + (b[1] - a[1]) * r, heading: bearing(a, b) };
      }
      remaining -= lengths[i];
    }
    return { lat: path[0][0], lng: path[0][1], heading: 0 };
  }
  function shipState(id) {
    const s = snapshot.ships.get(id);
    if (!s) return null;
    if (s.moving) {
      const leg = s.moving, route = by.routes.get(leg.routeId);
      const routeProgress = Math.max(0, Math.min(1, (snapshot.time - leg.departure) / (leg.arrival - leg.departure)));
      return { ...s, ...pointOnPath(route.path, routeProgress), routeProgress, atPortId: null };
    }
    const port = by.ports.get(s.call.portId);
    const nextRoute = s.nextLeg && by.routes.get(s.nextLeg.routeId);
    const heading = nextRoute ? bearing(nextRoute.path[0], nextRoute.path[1]) : 0;
    return { ...s, lat: port.lat, lng: port.lng, heading, routeProgress: null, atPortId: port.id };
  }
  function delayHoursOf(s) {
    if (s.moving) return s.moving.delayHours;
    return snapshot.time < s.call.departure ? s.call.delayHours : 0;
  }
  function latestEvent(shipId) {
    return snapshot.events.find((e) => e.shipId === shipId);
  }

  // ---------- 선택 ----------
  function selectShip(id) {
    const s = snapshot.ships.get(id);
    if (!s) return;
    commitNoteDraft();
    state.selectedVoyageId = s.v.id;
    state.selectedPortId = null;
    changed();
    renderDynamic();
    const pos = shipState(id);
    if (map && !map.getBounds().contains([pos.lat, pos.lng])) map.panTo([pos.lat, pos.lng], { animate: !reducedMotion });
  }
  function selectVoyage(id) {
    if (!by.voyages.has(id)) return;
    commitNoteDraft();
    state.selectedVoyageId = id;
    state.selectedPortId = null;
    changed();
    renderDynamic();
  }
  function selectPort(id) {
    if (!by.ports.has(id)) return;
    state.selectedPortId = id;
    changed();
    renderDynamic();
  }
  function setTime(epoch) {
    const t = Math.max(Date.parse(data.replay.start), Math.min(Date.parse(data.replay.end), Number(epoch)));
    if (!Number.isFinite(t)) return;
    state.time = t;
    changed();
    renderDynamic();
  }
  function toggleWatch(id) {
    if (!active || !by.ships.has(id)) return;
    const i = state.watchShips.indexOf(id);
    if (i >= 0) state.watchShips.splice(i, 1);
    else state.watchShips.push(id);
    lastPanelKey = '';
    changed();
    renderDynamic();
  }
  function focusRoute(id) {
    const route = by.routes.get(id);
    if (!route || !map) return;
    map.fitBounds(route.path, { padding: [60, 60], maxZoom: 10, animate: !reducedMotion });
  }
  function fitAll() {
    map.fitBounds(data.ports.map((p) => [p.lat, p.lng]), { paddingTopLeft: [60, 90], paddingBottomRight: [110, 40], animate: !reducedMotion });
  }

  // ---------- 지도 표시 배치 ----------
  // 위치 자료는 그대로 두고 화면 좌표에서만 배치한다. 항구 점·이름표·선박 표시의 눌리는 영역과
  // 지도 조작 버튼이 서로 겹치지 않도록 빈자리를 고르고, 실제 위치에서 옮긴 경우 안내선을 그린다.
  const HIT_GAP = 4;
  const DOT_SIZE = 18;
  const HULL_SIZE = 22;
  const DIRECTIONS = [[1, 0], [0, -1], [-1, 0], [0, 1], [0.71, -0.71], [-0.71, -0.71], [-0.71, 0.71], [0.71, 0.71]];
  const POINT_RINGS = [26, 44, 64, 88, 116];
  const LABEL_PUSH = [0, 14, 30, 50, 74, 100];
  const placementMemory = new Map();

  const collides = (r, placed) => placed.some((p) => r.x1 < p.x2 + HIT_GAP && r.x2 + HIT_GAP > p.x1 && r.y1 < p.y2 + HIT_GAP && r.y2 + HIT_GAP > p.y1);
  const inside = (r, b) => r.x1 >= b.x1 && r.y1 >= b.y1 && r.x2 <= b.x2 && r.y2 <= b.y2;
  const overlap = (r, placed) => placed.reduce((n, p) => n + Math.max(0, Math.min(r.x2, p.x2) - Math.max(r.x1, p.x1)) * Math.max(0, Math.min(r.y2, p.y2) - Math.max(r.y1, p.y1)), 0);

  // 이웃 표시에서 멀어지는 방향부터 시도한다.
  function directionOrder(anchor, anchors) {
    let vx = 0, vy = 0;
    for (const other of anchors) {
      const dx = anchor.x - other.x, dy = anchor.y - other.y, d = Math.hypot(dx, dy);
      if (other === anchor || d > 90) continue;
      if (d < 1) { vy -= 1; continue; }
      vx += dx / d; vy += dy / d;
    }
    return DIRECTIONS.map((dir, i) => ({ dir, i, score: dir[0] * vx + dir[1] * vy })).sort((a, b) => b.score - a.score || a.i - b.i);
  }

  // 가까운 자리(level이 낮은 순)부터 고르고, 같은 거리에서는 직전 방향을 유지해 재생 중 흔들림을 줄인다.
  function choose(key, candidates, placed, bounds) {
    const previous = placementMemory.get(key);
    const ordered = candidates
      .map((c, i) => ({ c, i }))
      .sort((a, b) => a.c.level - b.c.level || (b.c.id === previous) - (a.c.id === previous) || a.i - b.i)
      .map((x) => x.c);
    const best = ordered.find((c) => !collides(c.rect, placed) && inside(c.rect, bounds))
      || ordered.find((c) => !collides(c.rect, placed))
      || candidates.slice().sort((a, b) => overlap(a.rect, placed) - overlap(b.rect, placed))[0];
    placementMemory.set(key, best.id);
    placed.push(best.rect);
    return best;
  }

  function pointCandidates(anchor, anchors, rectFor) {
    const list = [{ id: 'at', level: 0, x: anchor.x, y: anchor.y }];
    const order = directionOrder(anchor, anchors);
    POINT_RINGS.forEach((ring, r) => {
      for (const { dir, i } of order) list.push({ id: `${ring}:${i}`, level: r + 1, x: anchor.x + dir[0] * ring, y: anchor.y + dir[1] * ring });
    });
    return list.map((c) => ({ ...c, rect: rectFor(c.x, c.y) }));
  }

  function labelCandidates(dot, w, h, anchors) {
    const g = DOT_SIZE / 2 + HIT_GAP + 1;
    const base = [
      [g, -h / 2], [-w / 2, -g - h], [-g - w, -h / 2], [-w / 2, g],
      [g, -g - h], [-g - w, -g - h], [-g - w, g], [g, g],
    ];
    const list = [];
    LABEL_PUSH.forEach((push, level) => {
      for (const { dir, i } of directionOrder(dot, anchors)) {
        const x = dot.x + base[i][0] + dir[0] * push, y = dot.y + base[i][1] + dir[1] * push;
        list.push({ id: `${push}:${i}`, level, push, rect: { x1: x, y1: y, x2: x + w, y2: y + h } });
      }
    });
    return list;
  }

  function controlRects(origin) {
    const box = map.getContainer().getBoundingClientRect();
    return [...document.querySelectorAll('.leaflet-control-zoom, .leaflet-control-attribution, .map-tools, #mapNotice:not([hidden])')].map((el) => {
      const r = el.getBoundingClientRect();
      return { x1: r.left - box.left + origin.x, y1: r.top - box.top + origin.y, x2: r.right - box.left + origin.x, y2: r.bottom - box.top + origin.y };
    });
  }

  function placeAt(el, rect, anchor) {
    el.style.left = `${Math.round(rect.x1 - anchor.x)}px`;
    el.style.top = `${Math.round(rect.y1 - anchor.y)}px`;
  }

  function drawLeader(el, from, to) {
    const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy);
    el.hidden = length < 1;
    el.style.left = `${Math.round(from.x)}px`;
    el.style.top = `${Math.round(from.y)}px`;
    el.style.width = `${length.toFixed(1)}px`;
    el.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
  }

  function nearestPoint(rect, p) {
    return { x: Math.max(rect.x1, Math.min(p.x, rect.x2)), y: Math.max(rect.y1, Math.min(p.y, rect.y2)) };
  }

  function layoutMap() {
    if (!map || !snapshot) return;
    const size = map.getSize(), origin = map.containerPointToLayerPoint([0, 0]);
    const bounds = { x1: origin.x + 2, y1: origin.y + 2, x2: origin.x + size.x - 2, y2: origin.y + size.y - 2 };
    const placed = controlRects(origin);
    const selectedShipId = !state.selectedPortId && by.voyages.get(state.selectedVoyageId)?.shipId;

    const ports = [...layers.ports].map(([id, marker]) => ({ id, el: marker.getElement(), anchor: map.latLngToLayerPoint(marker.getLatLng()).round() })).filter((x) => x.el);
    const ships = [...layers.ships].map(([id, marker]) => ({ id, el: marker.getElement(), anchor: map.latLngToLayerPoint(marker.getLatLng()).round() })).filter((x) => x.el)
      .sort((a, b) => (b.id === selectedShipId) - (a.id === selectedShipId));
    const anchors = [...ports, ...ships].map((x) => x.anchor);

    for (const p of ports) {
      const half = DOT_SIZE / 2;
      const c = choose(`dot:${p.id}`, pointCandidates(p.anchor, anchors, (x, y) => ({ x1: x - half, y1: y - half, x2: x + half, y2: y + half })), placed, bounds);
      p.dot = { x: c.x, y: c.y };
      placeAt(p.el.querySelector('.port-dot'), c.rect, p.anchor);
      drawLeader(p.el.querySelector('.leader-dot'), { x: 0, y: 0 }, { x: c.x - p.anchor.x, y: c.y - p.anchor.y });
      p.el.querySelector('.anchor-mark').hidden = c.id === 'at';
    }
    // 선박은 실제 위치에 가깝게 두는 것이 중요하므로 이름표보다 먼저 자리를 잡는다.
    for (const s of ships) {
      const button = s.el.querySelector('.ship-pin');
      const w = button.offsetWidth, half = HULL_SIZE / 2;
      const c = choose(`ship:${s.id}`, pointCandidates(s.anchor, anchors, (x, y) => ({ x1: x - half, y1: y - half, x2: x - half + w, y2: y + half })), placed, bounds);
      placeAt(button, c.rect, s.anchor);
      drawLeader(s.el.querySelector('.leader'), { x: 0, y: 0 }, { x: c.x - s.anchor.x, y: c.y - s.anchor.y });
      s.el.querySelector('.anchor-mark').hidden = c.id === 'at';
    }
    for (const p of ports) {
      const label = p.el.querySelector('.port-label');
      const c = choose(`label:${p.id}`, labelCandidates(p.dot, label.offsetWidth, label.offsetHeight, anchors), placed, bounds);
      placeAt(label, c.rect, p.anchor);
      const end = nearestPoint(c.rect, p.dot);
      const leader = p.el.querySelector('.leader-label');
      if (c.push > 0) drawLeader(leader, { x: p.dot.x - p.anchor.x, y: p.dot.y - p.anchor.y }, { x: end.x - p.anchor.x, y: end.y - p.anchor.y });
      else leader.hidden = true;
    }
  }

  // ---------- 지도 ----------
  function buildMap() {
    map = L.map('map', { zoomControl: true, keyboard: true, worldCopyJump: false, zoomSnap: 0.25, zoomDelta: 1 });
    fitAll();
    map.on('zoomend moveend resize', layoutMap);
    // 사용자가 지도를 움직이기 전에는 지도 크기가 바뀔 때마다 항구 전체가 보이도록 다시 맞춘다.
    let viewAdjusted = false, resizeFrame = null;
    for (const type of ['pointerdown', 'wheel', 'keydown']) map.getContainer().addEventListener(type, () => { viewAdjusted = true; }, { passive: true });
    new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        map.invalidateSize({ pan: false });
        if (!viewAdjusted) fitAll();
      });
    }).observe(map.getContainer());
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    tiles.once('tileerror', () => {
      const notice = $('mapNotice');
      notice.textContent = '배경 지도를 불러오지 못했습니다. 항로·항구·선박과 조작은 그대로 사용할 수 있습니다.';
      notice.hidden = false;
    });

    for (const route of data.routes) {
      const line = L.polyline(route.path, { color: '#5B8FA3', weight: 2, opacity: 0.55, dashArray: '4 6', interactive: false }).addTo(map);
      layers.routes.set(route.id, line);
    }
    for (const port of data.ports) {
      const icon = L.divIcon({
        className: 'port-icon',
        iconSize: [0, 0],
        html: `<span class="anchor-mark" hidden></span><span class="leader leader-dot" hidden></span><span class="leader leader-label" hidden></span>
          <span class="port-dot" data-port-dot="${port.id}" aria-hidden="true"></span>
          <button type="button" class="port-label" data-port="${port.id}" aria-pressed="false">${esc(port.name)}</button>`,
      });
      layers.ports.set(port.id, L.marker([port.lat, port.lng], { icon, keyboard: false }).addTo(map));
    }
    for (const ship of data.ships) {
      const icon = L.divIcon({
        className: 'ship-icon',
        iconSize: [0, 0],
        html: `<span class="anchor-mark ship-anchor" hidden></span><span class="leader" hidden></span>
          <button type="button" class="ship-pin" data-map-ship="${ship.id}" aria-pressed="false"><span class="hull">${SHIP_SVG}</span><span class="label">${esc(ship.id)}</span></button>`,
      });
      layers.ships.set(ship.id, L.marker([0, 0], { icon, keyboard: false, zIndexOffset: 1000 }).addTo(map));
    }
  }

  function renderMap(selected) {
    const selectedRouteId = selected && by.voyages.get(state.selectedVoyageId).routeId;
    for (const [id, line] of layers.routes) {
      if (id === selectedRouteId) line.setStyle({ color: '#007F86', weight: 5, opacity: 0.95, dashArray: null }).bringToFront();
      else line.setStyle({ color: '#5B8FA3', weight: 2, opacity: 0.55, dashArray: '4 6' });
    }
    for (const [id, marker] of layers.ports) {
      const el = marker.getElement();
      if (!el) continue;
      const button = el.querySelector('.port-label'), dot = el.querySelector('.port-dot');
      const port = by.ports.get(id), ps = snapshot.portStates.get(id);
      const warn = ps.status !== '정상', pressed = state.selectedPortId === id;
      button.classList.toggle('is-warn', warn);
      dot.classList.toggle('is-warn', warn);
      dot.classList.toggle('is-selected', pressed);
      const text = `${port.name} · ${ps.status}`;
      if (button.textContent !== text) button.textContent = text;
      button.setAttribute('aria-label', `항구 ${port.name}, ${ps.status}, 대기 ${ps.waitingVessels}척, 접안 ${ps.occupiedBerths}/${ps.totalBerths}선석`);
      button.setAttribute('aria-pressed', String(pressed));
    }
    for (const [id, marker] of layers.ships) {
      const pos = shipState(id);
      const button = marker.getElement()?.querySelector('button');
      marker.setLatLng([pos.lat, pos.lng]);
      if (!button) continue;
      button.querySelector('svg').style.transform = `rotate(${pos.heading}deg)`;
      const delay = delayHoursOf(pos);
      const isSelected = !state.selectedPortId && selected && selected.id === id;
      const watched = state.watchShips.includes(id);
      button.classList.toggle('is-delayed', delay > 0);
      const text = `${watched ? '★ ' : ''}${id}${delay > 0 ? ' 지연' : ''}`;
      if (button.querySelector('.label').textContent !== text) button.querySelector('.label').textContent = text;
      button.setAttribute('aria-pressed', String(isSelected));
      const where = pos.moving ? `운항 중 ${by.ports.get(by.routes.get(pos.moving.routeId).to).name} 방향` : by.ports.get(pos.call.portId).name;
      button.setAttribute('aria-label', `${pos.ship.name}, ${pos.status}, ${where}${delay > 0 ? `, 지연 ${duration(Math.round(delay * 60))}` : ''}${watched ? ', 관심 선박' : ''}`);
      marker.setZIndexOffset(isSelected ? 2000 : 1000);
    }
    layoutMap();
  }

  // ---------- 선박 목록 ----------
  // 내용이 바뀐 경우에만 다시 그리고, 누르고 있던 버튼의 포커스를 유지한다.
  const lastHtml = new WeakMap();
  function setHtml(container, html) {
    if (lastHtml.get(container) === html) return;
    const active = document.activeElement;
    const attrs = ['data-watch', 'data-ship', 'data-voyage', 'data-port', 'data-action'];
    const attr = active && container.contains(active) && attrs.find((a) => active.hasAttribute(a));
    const value = attr && active.getAttribute(attr);
    container.innerHTML = html;
    lastHtml.set(container, html);
    if (attr) container.querySelector(`[${attr}="${CSS.escape(value)}"]`)?.focus();
  }

  function workSummary(s) {
    const t = snapshot.time;
    const call = s.moving ? snapshot.calls.get(s.moving.toCallId) : s.call;
    const port = by.ports.get(call.portId).name;
    const outgoing = by.voyageFromCall.get(call.id);
    let current;
    if (s.moving) {
      const route = by.routes.get(s.moving.routeId);
      current = `운항 ${s.moving.displayId} · ${by.ports.get(route.from).name} → ${port} · ${port} 입항 예상 ${fmt(s.moving.arrival)}`;
    } else if (s.stage) {
      const label = s.stage === 'discharge' ? '하역' : '선적';
      const done = s.stage === 'discharge' ? call.dischargeDone : call.loadDone;
      const moves = call[s.stage].moves;
      current = `${port} ${label} ${num(Math.floor(done))}/${num(moves)}회 · ${Math.floor(done / moves * 100)}%`;
    } else {
      current = `${port} ${s.status}`;
    }
    const upcoming = [['하역 완료', call.dischargeEnd], ['선적 완료', call.loadEnd]];
    if (outgoing) upcoming.push(['출항 준비', call.ready], ['출항', call.departure]);
    const forecast = upcoming.filter(([, at]) => at > t).slice(0, 3).map(([label, at]) => `${label} ${fmt(at)}`).join(' · ');
    let next = '다음 일정 미등록';
    if (outgoing) {
      const leg = snapshot.legs.get(outgoing.id), route = by.routes.get(outgoing.routeId);
      next = `${outgoing.displayId} ${by.ports.get(route.from).name} → ${by.ports.get(route.to).name} · 출항 ${fmt(leg.departure)}`;
    }
    return { current, forecast: forecast ? `${port} ${forecast}` : `${port} 작업·출항 준비 완료`, next };
  }

  function renderShipList(selected) {
    const ships = state.watchOnly ? data.ships.filter((ship) => state.watchShips.includes(ship.id)) : data.ships;
    $('shipCount').textContent = state.watchOnly ? `관심 ${ships.length}/${data.ships.length}척` : `${data.ships.length}척`;
    $('watchOnly').checked = state.watchOnly;
    const empty = '<li class="list-empty">관심 선박이 없습니다. ‘관심 선박만 보기’를 해제하고 ☆ 관심을 눌러 추가하세요.</li>';
    setHtml($('shipList'), ships.length ? ships.map((ship) => {
      const s = snapshot.ships.get(ship.id);
      const delay = delayHoursOf(s);
      const event = latestEvent(ship.id);
      const current = !state.selectedPortId && selected && selected.id === ship.id;
      const watched = state.watchShips.includes(ship.id);
      const w = workSummary(s);
      return `<li class="ship-row"><button type="button" class="ship-item${delay > 0 ? ' is-delayed' : ''}" data-ship="${ship.id}" aria-current="${current}">
          <span class="row"><strong>${esc(ship.name)}</strong><span class="badge${s.moving ? '' : ' muted'}">${esc(s.status)}</span></span>
          ${delay > 0 ? `<span class="badge warn">지연 +${duration(Math.round(delay * 60))}</span>` : ''}
          <span class="sub"><b>현재</b> ${esc(w.current)}</span>
          <span class="sub"><b>예상</b> ${esc(w.forecast)}</span>
          <span class="sub"><b>다음 운항</b> ${esc(w.next)}</span>
          <span class="sub">최근 확인 ${event ? `${fmt(event.at)} · ${esc(event.title.replace(ship.name + ' · ', ''))}` : '기록 없음'}</span>
        </button>
        <button type="button" class="watch-btn" data-watch="${ship.id}" aria-pressed="${watched}" aria-label="${esc(ship.name)} 관심 선박"><span class="star" aria-hidden="true">${watched ? '★' : '☆'}</span>관심</button></li>`;
    }).join('') : empty);
  }

  // ---------- 항차 메모 ----------
  // 메모 입력란은 재생 중 다시 그려지지 않도록 상세 본문 밖에 두고, 선택 항차나 작업공간이 바뀔 때만 내용을 바꾼다.
  let noteShown = { state: null, voyageId: null }, noteDirty = false, noteNotice = '';
  function setNoteStatus(text, tone = '') {
    const el = $('noteStatus');
    el.textContent = text;
    el.className = `note-status${tone ? ` is-${tone}` : ''}`;
  }
  function saveNoteFor(voyageId, text) {
    if (text.trim()) state.notes[voyageId] = text;
    else delete state.notes[voyageId];
    noteDirty = false;
    changed();
  }
  function commitNoteDraft() {
    if (!noteDirty || !active || noteShown.state !== state) return;
    saveNoteFor(noteShown.voyageId, $('voyageNote').value);
    noteNotice = `${by.voyages.get(noteShown.voyageId).displayId} 메모를 자동 저장했습니다.`;
  }
  function renderNote() {
    $('notePanel').hidden = !active || !!state.selectedPortId;
    const v = by.voyages.get(state.selectedVoyageId);
    if (noteShown.state === state && noteShown.voyageId === v.id) return;
    noteShown = { state, voyageId: v.id };
    const route = by.routes.get(v.routeId);
    $('noteVoyage').textContent = `${v.displayId} ${by.ports.get(route.from).name} → ${by.ports.get(route.to).name}`;
    $('voyageNote').value = state.notes[v.id] ?? '';
    noteDirty = false;
    setNoteStatus(noteNotice || (state.notes[v.id] ? '저장된 메모입니다.' : ''));
    noteNotice = '';
  }
  async function saveNote() {
    if (!active) return;
    const v = by.voyages.get(noteShown.voyageId);
    saveNoteFor(v.id, $('voyageNote').value);
    setNoteStatus('저장 중…');
    try {
      await window.VoyageWorkspace?.flush();
      if (!noteDirty && noteShown.voyageId === v.id) setNoteStatus(`${v.displayId} 메모를 저장했습니다.`);
    } catch (err) {
      console.error(err);
      setNoteStatus('저장하지 못했습니다. 입력한 메모는 화면에 남아 있습니다.', 'error');
    }
  }

  // ---------- 상세: 선박·항차 ----------
  function stageTable(call) {
    const port = by.ports.get(call.portId);
    const hasNext = by.voyageFromCall.has(call.id);
    const rows = STAGES.map(([key, label]) => {
      const planned = `<td class="num">${fmt(call.plannedMs[key])}</td>`;
      if (key === 'departure' && !hasNext) return `<tr><th scope="row">${label}</th>${planned}<td colspan="2">다음 일정 미등록</td></tr>`;
      return `<tr><th scope="row">${label}</th>${planned}<td class="num">${fmt(call[key])}</td><td>${diffText(call[key] - call.plannedMs[key])}</td></tr>`;
    }).join('');
    return `<h3>${esc(port.name)} 기항 · 계획과 예상</h3>
      <div class="table-scroll"><table class="data-table">
        <caption>${esc(call.terminalName)} · ${esc(call.id)}</caption>
        <thead><tr><th scope="col">단계</th><th scope="col">계획</th><th scope="col">예상</th><th scope="col">차이</th></tr></thead>
        <tbody>${rows}</tbody></table></div>`;
  }

  function cargoTable(calls) {
    const t = snapshot.time;
    const rows = calls.flatMap((call) => {
      const port = by.ports.get(call.portId).name;
      return [['discharge', '하역', call.rate, call.dischargeDone, call.dischargeStart], ['load', '선적', call.load.rateMovesPerHour, call.loadDone, call.loadStart]].map(([key, label, rate, done, start]) => {
        const q = call[key];
        const progress = t < start ? '시작 전' : `${num(Math.floor(done))}/${num(q.moves)}회`;
        return `<tr><th scope="row">${esc(port)} ${label}</th><td class="num">${num(q.containers['20GP'])}</td><td class="num">${num(q.containers['40HC'])}</td><td class="num">${num(q.moves)}</td><td class="num">${num(q.teu)}</td><td class="num">${num(rate)}</td><td class="num">${progress}</td></tr>`;
      });
    }).join('');
    return `<h3>컨테이너 작업</h3>
      <div class="table-scroll"><table class="data-table">
        <thead><tr><th scope="col">작업</th><th scope="col" class="num">20GP</th><th scope="col" class="num">40HC</th><th scope="col" class="num">작업 회수</th><th scope="col" class="num">TEU</th><th scope="col" class="num">속도(회/시간)</th><th scope="col" class="num">완료</th></tr></thead>
        <tbody>${rows}</tbody></table></div>`;
  }

  function voyageStatus(leg) {
    if (snapshot.time >= leg.arrival) return '입항 완료';
    if (snapshot.time >= leg.departure) return '운항 중';
    return '예정';
  }

  function shipDetail() {
    const v = by.voyages.get(state.selectedVoyageId);
    const s = shipState(v.shipId);
    const leg = snapshot.legs.get(v.id);
    const route = by.routes.get(v.routeId);
    const from = snapshot.calls.get(v.fromCallId), to = snapshot.calls.get(v.toCallId);
    const fromPort = by.ports.get(from.portId), toPort = by.ports.get(to.portId);
    const t = snapshot.time;
    const parts = [];

    parts.push(`<p class="detail-kicker">선박 · 운항 재생 ${fmt(t)} KST 기준</p>
      <h3 class="detail-title">${esc(s.ship.name)} · 항차 ${esc(v.displayId)}</h3>
      <p class="detail-route">${esc(fromPort.name)} → ${esc(toPort.name)} <span class="badge${delayHoursOf(s) > 0 ? ' warn' : ''}">${esc(s.status)}</span></p>
      <p class="detail-kicker">${esc(v.id)} · ${esc(route.name)} · ${num(route.distanceNm.toFixed(0))}nm · 항해 ${v.durationHours}시간 · ${num(s.ship.capacityTEU)}TEU</p>`);

    if (s.v.id !== v.id) {
      parts.push(`<div class="notice"><p>${esc(s.ship.name)}의 현재·다음 항차는 ${esc(s.v.displayId)}입니다.</p><button type="button" class="link-btn" data-voyage="${s.v.id}">${esc(s.v.displayId)} 항차 보기</button></div>`);
    }

    if (from.observed) {
      const o = from.observed, delayed = from.delayHours > 0;
      parts.push(`<div class="notice${delayed ? ' warn' : ''}">
        <p><strong>작업 보고 ${fmt(Date.parse(o.reportedAt))}</strong> · ${esc(o.reportedBy)}</p>
        <p class="mono">하역 ${num(from.discharge.moves)}회 중 ${num(o.completedMoves)}회 완료 · 이후 ${from.rate}회/시간 조건 (계획 ${from.discharge.rateMovesPerHour}회/시간)</p>
        <p>${delayed ? '지연 사유' : '보고 내용'}: ${esc(o.reason)}</p>
        <p>${delayed ? `출항 예상 +${duration(Math.round(from.delayHours * 60))} 늦음 → ${esc(toPort.name)} 입항 +${duration(Math.round(leg.delayHours * 60))} 늦음` : '출항 계획 시각 유지'}</p>
      </div>`);
    }

    parts.push(`<dl class="facts">
      <div class="fact"><dt>${esc(fromPort.name)} 출항 예상</dt><dd>${fmt(leg.departure)} <small>계획 ${fmt(Date.parse(v.departure))}</small></dd></div>
      <div class="fact"><dt>${esc(toPort.name)} 입항 예상(ETA)</dt><dd>${fmt(leg.arrival)} <small>계획 ${fmt(Date.parse(v.plannedArrival))}</small></dd></div>
      <div class="fact"><dt>출항 지연</dt><dd>${from.delayHours > 0 ? `<span class="diff-late">+${duration(Math.round(from.delayHours * 60))}</span>` : '없음'}</dd></div>
      <div class="fact"><dt>입항 지연</dt><dd>${leg.delayHours > 0 ? `<span class="diff-late">+${duration(Math.round(leg.delayHours * 60))}</span>` : '없음'}</dd></div>
    </dl>
    <div class="detail-actions">
      <button type="button" data-action="focus-route">항로를 지도에서 보기</button>
      <button type="button" data-port="${fromPort.id}">${esc(fromPort.name)} 항구 보기</button>
      <button type="button" data-port="${toPort.id}">${esc(toPort.name)} 항구 보기</button>
    </div>`);

    parts.push(stageTable(from), stageTable(to), cargoTable([from, to]));

    const shipVoyages = data.voyages.filter((x) => x.shipId === v.shipId);
    const rows = shipVoyages.map((x) => {
      const l = snapshot.legs.get(x.id), r = by.routes.get(x.routeId);
      return `<tr class="${x.id === v.id ? 'is-current' : ''}"><td><button type="button" class="link-btn" data-voyage="${x.id}" aria-current="${x.id === v.id}">${esc(x.displayId)}</button></td>
        <td>${esc(by.ports.get(r.from).name)} → ${esc(by.ports.get(r.to).name)}</td><td class="num">${fmt(l.departure)}</td><td class="num">${fmt(l.arrival)}</td><td>${voyageStatus(l)}${l.delayHours > 0 ? ' · <span class="diff-late">지연</span>' : ''}</td></tr>`;
    }).join('');
    parts.push(`<h3>${esc(s.ship.name)} 항차 목록</h3>
      <div class="table-scroll"><table class="data-table">
        <thead><tr><th scope="col">항차</th><th scope="col">구간</th><th scope="col">출항 예상</th><th scope="col">입항 예상</th><th scope="col">상태</th></tr></thead>
        <tbody>${rows}<tr><td colspan="5">이후 다음 일정 미등록</td></tr></tbody></table></div>`);
    return parts.join('');
  }

  // ---------- 상세: 항구 ----------
  function callStatus(call) {
    const t = snapshot.time, hasNext = by.voyageFromCall.has(call.id);
    if (t < call.arrival) return '입항 예정';
    if (t < call.berth) return '입항 대기';
    if (hasNext && t < call.departure) return '접안 중';
    if (!hasNext && t < call.ready) return '접안 중';
    return hasNext ? '출항 완료' : '다음 일정 미등록';
  }

  function portDetail() {
    const port = by.ports.get(state.selectedPortId);
    const ps = snapshot.portStates.get(port.id);
    const warn = ps.status !== '정상';
    const here = data.ships.map((ship) => snapshot.ships.get(ship.id)).filter((s) => !s.moving && s.call.portId === port.id && snapshot.time >= s.call.arrival);
    const calls = data.portCalls.filter((c) => c.portId === port.id).map((c) => snapshot.calls.get(c.id)).sort((a, b) => a.arrival - b.arrival);

    const hereList = here.length
      ? `<ul class="ship-list">${here.map((s) => `<li><button type="button" class="ship-item${delayHoursOf(s) > 0 ? ' is-delayed' : ''}" data-ship="${s.ship.id}"><span class="row"><strong>${esc(s.ship.name)}</strong><span class="badge muted">${esc(s.status)}</span></span><span class="sub">항차 ${esc(s.v.displayId)}</span></button></li>`).join('')}</ul>`
      : '<p>현재 이 항구에 있는 등록 선박이 없습니다.</p>';

    const rows = calls.map((c) => {
      const incoming = by.voyageToCall.get(c.id), outgoing = by.voyageFromCall.get(c.id);
      const status = callStatus(c);
      const delay = c.delayHours > 0 && status !== '출항 완료' ? ` · <span class="diff-late">출항 +${duration(Math.round(c.delayHours * 60))}</span>` : '';
      const related = [
        incoming ? `<button type="button" class="link-btn" data-voyage="${incoming.id}">${esc(incoming.displayId)} 도착</button>` : '',
        outgoing ? `<button type="button" class="link-btn" data-voyage="${outgoing.id}">${esc(outgoing.displayId)} 출발</button>` : '',
      ].filter(Boolean).join(' · ') || '—';
      return `<tr class="${status === '접안 중' || status === '입항 대기' ? 'is-current' : ''}"><td><button type="button" class="link-btn" data-ship="${c.shipId}">${esc(by.ships.get(c.shipId).name)}</button></td>
        <td class="num">${fmt(c.arrival)}<br><small>계획 ${fmt(c.plannedMs.arrival)}</small></td>
        <td class="num">${outgoing ? `${fmt(c.departure)}<br><small>계획 ${fmt(c.plannedMs.departure)}</small>` : '미등록'}</td>
        <td>${status}${delay}</td><td>${related}</td></tr>`;
    }).join('');

    return `<p class="detail-kicker">항구 · 상태 기준 ${fmt(Date.parse(ps.at))} KST</p>
      <h3 class="detail-title">${esc(port.name)}</h3>
      <p class="detail-route">${esc(port.terminalName)} <span class="badge${warn ? ' warn' : ''}">${esc(ps.status)}</span></p>
      ${ps.reason ? `<div class="notice warn"><p>${esc(ps.reason)}</p></div>` : ''}
      <dl class="facts">
        <div class="fact"><dt>입항 대기</dt><dd>${ps.waitingVessels}척</dd></div>
        <div class="fact"><dt>등록 선박 접안</dt><dd>${ps.occupiedBerths}척 <small>/ 선석 ${ps.totalBerths}</small></dd></div>
        <div class="fact"><dt>최대 흘수</dt><dd>${port.maxDraftM}m</dd></div>
        <div class="fact"><dt>등록 기항</dt><dd>${calls.length}건</dd></div>
      </dl>
      <p class="detail-kicker">대기·접안 척수는 이 화면에 등록된 선박 기준입니다.</p>
      <h3>현재 정박 중인 등록 선박</h3>
      ${hereList}
      <h3>입출항 일정과 관련 항차</h3>
      <div class="table-scroll"><table class="data-table">
        <thead><tr><th scope="col">선박</th><th scope="col">입항 예상</th><th scope="col">출항 예상</th><th scope="col">상태</th><th scope="col">관련 항차</th></tr></thead>
        <tbody>${rows}</tbody></table></div>`;
  }

  function renderDetail() {
    $('detailTitle').textContent = state.selectedPortId ? '항구 상세' : '항차 상세';
    setHtml($('detailContent'), state.selectedPortId ? portDetail() : shipDetail());
  }

  // ---------- 전체 갱신 ----------
  // 재생 중에는 지도는 매 프레임, 목록·상세는 0.25초마다 갱신한다.
  // 목록·상세를 누르는 동안에는 버튼이 교체되어 클릭이 사라지지 않도록 갱신을 미룬다.
  const PANEL_INTERVAL_MS = 250;
  let lastPanelAt = 0, lastPanelKey = '', pointerHeld = false, panelsStale = false;
  document.addEventListener('pointerdown', (e) => {
    pointerHeld = !!e.target.closest('#shipList, #detailBody');
  }, true);
  document.addEventListener('pointerup', () => {
    pointerHeld = false;
    if (panelsStale) requestAnimationFrame(renderDynamic);
  }, true);

  function renderDynamic() {
    if (rendering) return;
    rendering = true;
    try {
      calculate();
      const selected = by.ships.get(by.voyages.get(state.selectedVoyageId)?.shipId);
      $('replayTime').textContent = fmtFull(snapshot.time);
      $('replayTime').dateTime = new Date(snapshot.time).toISOString();
      renderMap(selected);
      const key = `${state.selectedVoyageId}|${state.selectedPortId}`;
      const now = performance.now();
      const throttled = window.VoyageApp?.playing && key === lastPanelKey && now - lastPanelAt < PANEL_INTERVAL_MS;
      panelsStale = throttled || pointerHeld;
      if (!panelsStale) {
        renderShipList(selected);
        lastPanelAt = now;
        lastPanelKey = key;
      }
      window.dispatchEvent(new CustomEvent('voyage-ships-render', { detail: { snapshot } }));
      renderNote();
      if (!panelsStale) renderDetail();
      window.dispatchEvent(new CustomEvent('voyage-detail-render', { detail: { snapshot } }));
    } finally {
      rendering = false;
    }
  }

  // ---------- 참고 월간 실적 ----------
  function aggregate(voyages) {
    const sum = (k) => voyages.reduce((n, v) => n + v.performance[k], 0);
    const capacity = sum('총선복TEU'), loaded = sum('선적TEU');
    return { count: voyages.length, capacity, booked: sum('확정부킹TEU'), loaded, rollover: sum('롤오버TEU'), revenue: sum('운임수입USD'), utilization: capacity ? (loaded / capacity * 100).toFixed(1) + '%' : '—' };
  }

  function renderMonthly() {
    const filter = $('routeFilter');
    if (!filter.options.length) {
      filter.innerHTML = '<option value="all">전체</option>' + data.historicalRoutes.map((r) => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('');
    }
    if (![...filter.options].some((o) => o.value === state.route)) state.route = 'all';
    filter.value = state.route;

    const voyages = data.historicalVoyages.filter((v) => state.route === 'all' || v.routeId === state.route);
    const a = aggregate(voyages);
    const scope = state.route === 'all' ? '전체' : by.historicalRoutes.get(state.route).name;
    $('monthlySummary').innerHTML = [
      ['범위', `${esc(scope)} ${a.count}항차`],
      ['총선복', `${num(a.capacity)}TEU`],
      ['확정부킹', `${num(a.booked)}TEU`],
      ['선적', `${num(a.loaded)}TEU`],
      ['가중 소석률', a.utilization],
      ['롤오버', `${num(a.rollover)}TEU`],
      ['운임수입', `${num(a.revenue)}USD`],
    ].map(([label, value]) => `<div class="card"><span>${label}</span><strong>${value}</strong></div>`).join('');

    const compare = [{ id: 'all', name: '전체', voyages: data.historicalVoyages }, ...data.historicalRoutes.map((r) => ({ id: r.id, name: r.name, voyages: data.historicalVoyages.filter((v) => v.routeId === r.id) }))];
    $('routeCompareRows').innerHTML = compare.map((r) => {
      const x = aggregate(r.voyages);
      return `<tr class="${r.id === state.route ? 'is-selected-route' : ''}"><th scope="row">${esc(r.name)}${r.id === state.route ? ' (선택)' : ''}</th><td class="num">${x.count}</td><td class="num">${num(x.capacity)}</td><td class="num">${num(x.loaded)}</td><td class="num">${x.utilization}</td><td class="num">${num(x.rollover)}</td><td class="num">${num(x.revenue)}</td></tr>`;
    }).join('');

    $('monthlyRows').innerHTML = voyages.map((v) => {
      const p = v.performance;
      return `<tr><td>${esc(v.id)}</td><td>${esc(v.shipId)}</td><td>${esc(by.historicalRoutes.get(v.routeId).name)}</td><td class="num">${fmtDate(Date.parse(v.departure))}</td><td class="num">${num(p['총선복TEU'])}</td><td class="num">${num(p['확정부킹TEU'])}</td><td class="num">${num(p['선적TEU'])}</td><td class="num">${num(p['롤오버TEU'])}</td><td class="num">${(p['선적TEU'] / p['총선복TEU'] * 100).toFixed(1)}%</td><td class="num">${num(p['운임수입USD'])}</td></tr>`;
    }).join('');
  }

  // ---------- 입력 연결 ----------
  function bindEvents() {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-watch], [data-map-ship], [data-ship], [data-voyage], [data-port], [data-port-dot], [data-action]');
      if (!el) return;
      if (el.dataset.watch) toggleWatch(el.dataset.watch);
      else if (el.dataset.mapShip) selectShip(el.dataset.mapShip);
      else if (el.dataset.ship) selectShip(el.dataset.ship);
      else if (el.dataset.voyage) selectVoyage(el.dataset.voyage);
      else if (el.dataset.port) selectPort(el.dataset.port);
      else if (el.dataset.portDot) selectPort(el.dataset.portDot);
      else if (el.dataset.action === 'focus-route') focusRoute(by.voyages.get(state.selectedVoyageId).routeId);
    });
    $('detailToggle').addEventListener('click', () => {
      const body = $('detailBody');
      body.hidden = !body.hidden;
      $('detailToggle').setAttribute('aria-expanded', String(!body.hidden));
      $('detailToggle').textContent = body.hidden ? '상세 펼치기' : '상세 접기';
    });
    $('watchOnly').addEventListener('change', (e) => {
      if (!active) return;
      state.watchOnly = e.target.checked;
      lastPanelKey = '';
      changed();
      renderDynamic();
    });
    $('voyageNote').addEventListener('input', () => {
      noteDirty = true;
      setNoteStatus('저장하지 않은 변경이 있습니다.', 'dirty');
    });
    $('saveNote').addEventListener('click', saveNote);
    $('routeFilter').addEventListener('change', (e) => {
      state.route = e.target.value;
      changed();
      renderMonthly();
    });
    $('fitAll').addEventListener('click', fitAll);
    $('fitSelected').addEventListener('click', () => {
      if (state.selectedPortId) {
        const port = by.ports.get(state.selectedPortId);
        map.setView([port.lat, port.lng], 9, { animate: !reducedMotion });
      } else {
        focusRoute(by.voyages.get(state.selectedVoyageId).routeId);
      }
    });
  }

  async function start() {
    try {
      const response = await fetch('data.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('data.json ' + response.status);
      data = await response.json();
    } catch (err) {
      $('detailContent').textContent = '운항 자료를 불러오지 못했습니다. 터미널에서 npm start로 다시 실행해 주세요.';
      console.error(err);
      return;
    }
    for (const name of ['ships', 'ports', 'routes', 'voyages', 'portCalls', 'historicalRoutes']) by[name] = new Map(data[name].map((x) => [x.id, x]));
    by.voyageFromCall = new Map(data.voyages.map((v) => [v.fromCallId, v]));
    by.voyageToCall = new Map(data.voyages.map((v) => [v.toCallId, v]));
    engine = globalThis.VoyageEngine.create(data);
    state = fresh();

    window.VoyageApp = {
      get data() { return data; },
      get state() { return state; },
      get snapshot() { return snapshot; },
      get active() { return active; },
      fresh, changed, selectShip, selectVoyage, selectPort, setTime,
      renderDynamic, renderMonthly, shipState, focusRoute, restore, lock,
    };

    buildMap();
    bindEvents();
    renderDynamic();
    renderMonthly();
    window.dispatchEvent(new CustomEvent('voyage-ready', { detail: { app: window.VoyageApp } }));
    // 재생 조작·소식이 채워져 지도 높이가 정해진 뒤 항구 전체가 보이도록 다시 맞춘다.
    requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      fitAll();
    });
  }

  start();
})();
