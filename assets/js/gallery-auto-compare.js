// Gallery-only enhancement: automatic 1.5-second alternation with optional photo controls.
(function () {
  'use strict';
  var boxes = Array.from(document.querySelectorAll('.gallery-compare'));
  if (!boxes.length) return;
  var states = [];
  var refreshPending = false;
  function inViewport(box) {
    var rect = box.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight);
  }
  function sync(state) {
    var active = inViewport(state.box) && !document.hidden && !state.paused;
    state.box.classList.toggle('is-in-view', active);
    if (!active) {
      clearTimeout(state.timer); state.timer = null;
    } else if (state.timer === null) {
      state.timer = setTimeout(function () {
        state.timer = null;
        if (inViewport(state.box) && !document.hidden && !state.paused) {
          state.current = state.current === 'before' ? 'after' : 'before';
          state.render();
        }
        sync(state);
      }, 1500);
    }
  }
  function refresh() { states.forEach(sync); }
  function requestRefresh() {
    if (refreshPending) return;
    refreshPending = true;
    requestAnimationFrame(function () { refreshPending = false; refresh(); });
  }
  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(refresh, {threshold:0}) : null;

  boxes.forEach(function (box, index) {
    var before = box.querySelector('.ba__pic--b');
    var after = box.querySelector('.ba__pic--a');
    if (!before || !after) return;
    var label = (index + 1) + '번째 시술 사례';
    var state = {box: box, paused: false, selected: null, current: 'before', timer: null};
    var controls = document.createElement('div');
    controls.className = 'gallery-compare__controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', label + ' 시술 전후 보기');
    controls.innerHTML = '<div class="gallery-compare__state" aria-hidden="true"><span class="gallery-state--before">시술 전</span><span class="gallery-state--after">시술 후</span></div>' +
      '<div class="gallery-compare__choices"><button type="button" data-show="before" aria-pressed="false">시술 전</button><button type="button" data-show="after" aria-pressed="false">시술 후</button></div>' +
      '<button type="button" class="gallery-compare__toggle" aria-pressed="false"><span aria-hidden="true">Ⅱ</span> 멈춰 보기</button>';
    var beforeButton = controls.querySelector('[data-show="before"]');
    var afterButton = controls.querySelector('[data-show="after"]');
    var toggle = controls.querySelector('.gallery-compare__toggle');
    [beforeButton, afterButton, toggle].forEach(function (button) {
      button.setAttribute('aria-controls', box.id);
    });
    beforeButton.setAttribute('aria-label', label + ' 시술 전 사진 보기');
    afterButton.setAttribute('aria-label', label + ' 시술 후 사진 보기');
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', label + ' 시술 전후 사진');
    box.querySelectorAll('.ba__label,.ba__divider').forEach(function (node) { node.remove(); });
    // This runs before main.js, so the obsolete pointer slider is not installed here.
    box.classList.remove('ba--fade');
    box.classList.add('is-enhanced');
    box.parentNode.insertAdjacentElement('afterend', controls);

    var beforeLabel = controls.querySelector('.gallery-state--before');
    var afterLabel = controls.querySelector('.gallery-state--after');
    [after, beforeLabel, afterLabel].forEach(function(node) {
      node.style.setProperty('animation', 'none', 'important');
    });
    function render() {
      box.setAttribute('data-compare-state', state.current);
      controls.setAttribute('data-compare-state', state.current);
      after.style.opacity = state.current === 'after' ? '1' : '0';
      beforeLabel.style.opacity = state.current === 'before' ? '1' : '0';
      afterLabel.style.opacity = state.current === 'after' ? '1' : '0';
      box.classList.toggle('is-paused', state.paused);
      box.classList.toggle('show-before', state.selected === 'before');
      box.classList.toggle('show-after', state.selected === 'after');
      controls.classList.toggle('show-before', state.selected === 'before');
      controls.classList.toggle('show-after', state.selected === 'after');
      beforeButton.setAttribute('aria-pressed', String(state.selected === 'before'));
      afterButton.setAttribute('aria-pressed', String(state.selected === 'after'));
      toggle.setAttribute('aria-pressed', String(state.paused));
      toggle.innerHTML = state.paused ? '<span aria-hidden="true">▶</span> 다시 보기' : '<span aria-hidden="true">Ⅱ</span> 멈춰 보기';
      toggle.setAttribute('aria-label', label + (state.paused ? ' 자동 비교 재생' : ' 자동 비교 일시정지'));
    }
    function show(which) {
      state.paused = true;
      state.selected = which;
      state.current = which;
      render();
      sync(state);
    }
    beforeButton.addEventListener('click', function () { show('before'); });
    afterButton.addEventListener('click', function () { show('after'); });
    toggle.addEventListener('click', function () {
      if (!state.paused) {
        // Pause on a full photograph, rather than leaving a half-dissolved face.
        show(parseFloat(getComputedStyle(after).opacity) >= .5 ? 'after' : 'before');
      } else {
        state.paused = false;
        state.selected = null;
        render();
        sync(state);
      }
    });
    state.render = render;
    box.classList.remove('is-reduced');
    controls.classList.remove('is-reduced');
    render();
    states.push(state);
    sync(state);
    if (observer) observer.observe(box);
  });

  // A timer changes the actual displayed photo, independent of CSS animation
  // preferences. Offscreen/background cards wait without losing their state.
  window.addEventListener('scroll', requestRefresh, {passive:true});
  window.addEventListener('resize', requestRefresh);
  document.addEventListener('visibilitychange', refresh);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('pagehide', function() {
    states.forEach(function(state) { clearTimeout(state.timer); state.timer = null; });
  });
})();
