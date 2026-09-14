// 운항 재생: 재생·정지, 속도, 시각 슬라이더, 날짜·시각 이동. 시각만 바꾸고 계산·그리기는 VoyageApp에 맡긴다.
(function () {
  'use strict';
  const H = 3600000;
  const MAX_FRAME_MS = 250;
  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, '0');

  let app, start, end, initial, playing = false, frame = null, lastFrameAt = null;

  function kst(t) {
    const d = new Date(t + 9 * H);
    return { date: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`, time: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}` };
  }
  const label = (t) => { const k = kst(t); return `${k.date.slice(5).replace('-', '/')} ${k.time}`; };

  function notify() {
    const button = $('playToggle');
    button.textContent = playing ? '정지' : '재생';
    button.setAttribute('aria-pressed', String(playing));
    window.dispatchEvent(new CustomEvent('voyage-playback-change', { detail: { playing } }));
  }

  function play() {
    if (playing) return;
    if (app.state.time >= end) app.setTime(start);
    playing = true;
    lastFrameAt = null;
    frame = requestAnimationFrame(tick);
    notify();
  }

  function pause(save = true) {
    if (!playing) return;
    playing = false;
    cancelAnimationFrame(frame);
    frame = null;
    notify();
    app.renderDynamic();
    if (save) app.changed();
  }

  // 1배속에서 1초 = data.replay.minutesPerSecondAt1x분
  function tick(now) {
    if (!playing) return;
    const elapsed = lastFrameAt === null ? 0 : Math.min(MAX_FRAME_MS, now - lastFrameAt);
    lastFrameAt = now;
    const next = app.state.time + elapsed / 1000 * app.data.replay.minutesPerSecondAt1x * 60000 * app.state.speed;
    if (next >= end) {
      app.state.time = end;
      pause(true);
      return;
    }
    app.state.time = next;
    app.renderDynamic();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    const t = app.state.time;
    const slider = $('timeSlider');
    if (Number(slider.value) !== t) slider.value = t;
    slider.setAttribute('aria-valuetext', `${label(t)} KST`);
    $('sliderValue').textContent = `${label(t)} KST`;
    if (!$('jumpForm').contains(document.activeElement)) {
      const k = kst(t);
      $('jumpDate').value = k.date;
      $('jumpTime').value = k.time;
    }
    if ($('speedSelect').value !== String(app.state.speed)) $('speedSelect').value = String(app.state.speed);
  }

  function jumpTo(epoch) {
    pause(false);
    $('jumpError').hidden = true;
    app.setTime(epoch);
  }

  function init() {
    app = window.VoyageApp;
    const replay = app.data.replay;
    start = Date.parse(replay.start);
    end = Date.parse(replay.end);
    initial = Date.parse(replay.initial);

    Object.defineProperty(app, 'playing', { get: () => playing, enumerable: true, configurable: true });
    app.play = play;
    app.pause = pause;

    const perSecond = (speed) => {
      const minutes = replay.minutesPerSecondAt1x * speed;
      return minutes >= 60 ? `${Math.floor(minutes / 60)}시간${minutes % 60 ? ` ${minutes % 60}분` : ''}` : `${minutes}분`;
    };
    $('speedSelect').innerHTML = replay.speeds.map((s) => `<option value="${s}">${s}배 · 1초에 ${perSecond(s)}</option>`).join('');
    if (!replay.speeds.includes(app.state.speed)) app.state.speed = replay.speeds[0];

    const slider = $('timeSlider');
    slider.min = start;
    slider.max = end;
    slider.step = 5 * 60000;
    $('jumpDate').min = kst(start).date;
    $('jumpDate').max = kst(end).date;
    $('jumpDefault').textContent = `기본 시각 ${label(initial)}`;

    $('playToggle').addEventListener('click', () => (playing ? pause() : play()));
    $('speedSelect').addEventListener('change', (e) => {
      app.state.speed = Number(e.target.value);
      app.changed();
    });
    slider.addEventListener('input', () => {
      app.state.time = Number(slider.value);
      app.renderDynamic();
    });
    slider.addEventListener('change', () => app.changed());
    $('jumpForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const date = $('jumpDate').value, time = $('jumpTime').value;
      const epoch = Date.parse(`${date}T${time}:00+09:00`);
      if (!date || !time || !Number.isFinite(epoch) || epoch < start || epoch > end) {
        $('jumpError').textContent = `재생 범위 ${label(start)} ~ ${label(end)} KST 안의 날짜와 시각을 입력하세요.`;
        $('jumpError').hidden = false;
        return;
      }
      jumpTo(epoch);
    });
    $('jumpDefault').addEventListener('click', () => jumpTo(initial));

    window.addEventListener('voyage-ships-render', sync);
    sync();
    notify();
  }

  if (window.VoyageApp?.snapshot) init();
  else window.addEventListener('voyage-ready', init, { once: true });
})();
