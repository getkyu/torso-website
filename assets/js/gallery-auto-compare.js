// Gallery-only enhancement: five-second before/after cycle, controls below the image.
(function () {
  'use strict';
  var boxes = Array.from(document.querySelectorAll('.gallery-compare'));
  if (!boxes.length) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var states = [];
  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('is-in-view', entry.isIntersecting && entry.intersectionRatio >= .2);
    });
  }, {threshold: [0, .2]}) : null;

  boxes.forEach(function (box, index) {
    var before = box.querySelector('.ba__pic--b');
    var after = box.querySelector('.ba__pic--a');
    if (!before || !after) return;
    var label = (index + 1) + '번째 시술 사례';
    var state = {box: box, paused: false, selected: null};
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

    function render() {
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
      render();
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
      }
    });
    state.configure = function () {
      box.classList.toggle('is-reduced', reduced.matches);
      controls.classList.toggle('is-reduced', reduced.matches);
      toggle.hidden = reduced.matches;
      state.paused = reduced.matches;
      state.selected = reduced.matches ? 'after' : null;
      render();
    };
    state.configure();
    states.push(state);
    if (observer) observer.observe(box);
    else box.classList.add('is-in-view');
  });

  function pageVisibility() {
    states.forEach(function (state) { state.box.classList.toggle('is-page-hidden', document.hidden); });
  }
  document.addEventListener('visibilitychange', pageVisibility);
  pageVisibility();
  reduced.addEventListener('change', function () { states.forEach(function (state) { state.configure(); }); });
})();
