
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
  var view = figure.querySelector('[data-sim-view]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var active = 0, timer = 0, inView = false, enabled = !reduce.matches;
  var play = figure.querySelector('[data-sim-play]');
  function render(value) { view.dataset.simView = String(value); }
  function change(state, immediate) {
    active = state;
    figure.querySelector('[data-sim-status]').textContent = state ? '볼륨 설계' : '기존 흐름';
    figure.querySelectorAll('[data-sim-state]').forEach(function (button) { button.setAttribute('aria-pressed', String(Number(button.dataset.simState) === state)); });
    render(state);
  }
  function visible() { return inView && !document.hidden && !figure.closest('[hidden]'); }
  function syncPlayback() {
    clearTimeout(timer);
    play.setAttribute('aria-pressed', String(enabled));
    play.textContent = enabled ? '자동 비교 멈춤' : '자동 비교';
    if (enabled && visible()) timer = setTimeout(function () { change(1 - active, false); syncPlayback(); }, 3400);
    else { render(active); }
  }
  figure.querySelectorAll('[data-sim-state]').forEach(function (button) {
    button.addEventListener('click', function () { enabled = false; clearTimeout(timer); change(Number(button.dataset.simState), false); play.setAttribute('aria-pressed', 'false'); play.textContent = '자동 비교'; });
  });
  play.addEventListener('click', function () { enabled = !enabled; syncPlayback(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; syncPlayback(); }, {threshold: 0.1}).observe(figure);
  else inView = true;
  document.addEventListener('visibilitychange', syncPlayback);
  window.addEventListener('pagehide', function () { clearTimeout(timer); });
  window.addEventListener('pageshow', syncPlayback);
  function motionChange() { if (reduce.matches) enabled = false; syncPlayback(); }
  if (reduce.addEventListener) reduce.addEventListener('change', motionChange);
  else reduce.addListener(motionChange);
  syncPlayback();
})();
