
(function () {
  'use strict';
  var lab = document.querySelector('.consult-lab');
  if (!lab) return;
  var tabs = Array.from(lab.querySelectorAll('[role="tab"]'));
  var panels = Array.from(lab.querySelectorAll('[role="tabpanel"]'));
  function selectTab(index, focus) {
    tabs.forEach(function (tab, i) { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    panels.forEach(function (panel, i) { panel.hidden = i !== index; });
    if (focus) tabs[index].focus();
    syncPlayback();
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { selectTab(index, false); });
    tab.addEventListener('keydown', function (event) {
      var next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); selectTab(next, true);
    });
  });
  var figure = lab.querySelector('[data-consult-simulation]');
  var hair = figure.querySelector('[data-sim-hair]');
  var base = hair.getAttribute('d');
  var designed = 'M169 156C153 105 175 47 227 49C279 41 328 71 350 109C375 144 368 180 340 214L285 265L273 231C276 206 264 190 253 190C239 190 233 205 238 225L228 244L222 172C198 165 184 158 169 156Z';
  var fromNumbers = base.match(/-?\d+(?:\.\d+)?/g).map(Number);
  var toNumbers = designed.match(/-?\d+(?:\.\d+)?/g).map(Number);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var active = 0, progress = 0, frame = 0, timer = 0, inView = false, enabled = !reduce.matches;
  var play = figure.querySelector('[data-sim-play]');
  function render(value) {
    progress = value;
    var i = 0;
    hair.setAttribute('d', base.replace(/-?\d+(?:\.\d+)?/g, function () { var n = fromNumbers[i] + (toNumbers[i] - fromNumbers[i]) * value; i++; return n.toFixed(2); }));
    figure.querySelectorAll('.sim-flow--base,.sim-part--base').forEach(function (node) { node.style.opacity = 1 - value; });
    figure.querySelectorAll('.sim-flow--design,.sim-part--design').forEach(function (node) { node.style.opacity = value; });
  }
  function change(state, immediate) {
    active = state;
    cancelAnimationFrame(frame);
    figure.querySelector('[data-sim-status]').textContent = state ? '볼륨 설계' : '기존 흐름';
    figure.querySelectorAll('[data-sim-state]').forEach(function (button) { button.setAttribute('aria-pressed', String(Number(button.dataset.simState) === state)); });
    if (immediate || reduce.matches) { render(state); return; }
    var start = null, initial = progress;
    function tick(now) { if (start === null) start = now; var t = Math.min(1, (now - start) / 950); var eased = t * t * (3 - 2 * t); render(initial + (state - initial) * eased); if (t < 1) frame = requestAnimationFrame(tick); }
    frame = requestAnimationFrame(tick);
  }
  function visible() { return inView && !document.hidden && !figure.closest('[hidden]'); }
  function syncPlayback() {
    clearTimeout(timer);
    play.setAttribute('aria-pressed', String(enabled));
    play.textContent = enabled ? '자동 비교 멈춤' : '자동 비교';
    if (enabled && visible()) timer = setTimeout(function () { change(1 - active, false); syncPlayback(); }, 3400);
    else { cancelAnimationFrame(frame); render(active); }
  }
  figure.querySelectorAll('[data-sim-state]').forEach(function (button) {
    button.addEventListener('click', function () { enabled = false; clearTimeout(timer); change(Number(button.dataset.simState), false); play.setAttribute('aria-pressed', 'false'); play.textContent = '자동 비교'; });
  });
  play.addEventListener('click', function () { enabled = !enabled; syncPlayback(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; syncPlayback(); }, {threshold: 0.1}).observe(figure);
  else inView = true;
  document.addEventListener('visibilitychange', syncPlayback);
  window.addEventListener('pagehide', function () { clearTimeout(timer); cancelAnimationFrame(frame); });
  window.addEventListener('pageshow', syncPlayback);
  function motionChange() { if (reduce.matches) enabled = false; syncPlayback(); }
  if (reduce.addEventListener) reduce.addEventListener('change', motionChange);
  else reduce.addListener(motionChange);
  syncPlayback();
})();
