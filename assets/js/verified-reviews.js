/* Verified photo reviews rotate as a complete photo + quotation + author card. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hover = window.matchMedia('(hover: hover)');
  var decks = [];
  var suspended = false;
  var interval = 7000;

  function stopTimer(state) {
    clearTimeout(state.timer);
    state.timer = null;
  }
  function canRotate(state) {
    return state.slides.length > 1 && state.visible && !document.hidden && !suspended &&
      !reduced.matches && !state.userPaused && (state.explicitRun || (!state.hovered && !state.focused));
  }
  function canPlayMedia(state) {
    return state.visible && !document.hidden && !suspended && !reduced.matches &&
      !state.userPaused && (state.explicitRun || (!state.hovered && !state.focused));
  }
  function syncMedia(state) {
    state.slides.forEach(function (slide, index) {
      slide.querySelectorAll('video').forEach(function (video) {
        if (index !== state.index || !canPlayMedia(state)) {
          video.pause();
          return;
        }
        if (!video.paused) return;
        try {
          var playing = video.play();
          if (playing && playing.then) playing.then(function () {
            if (index !== state.index || !canPlayMedia(state)) video.pause();
          }).catch(function () {});
        } catch (error) { /* Keep the poster when the browser blocks autoplay. */ }
      });
    });
  }
  function mediaReady(media) {
    return new Promise(function (resolve) {
      var image = media.tagName === 'IMG';
      if (image && media.complete) { resolve(media.naturalWidth > 0); return; }
      if (!image && media.readyState >= 2) { resolve(true); return; }
      var finished = false;
      var successEvent = image ? 'load' : 'loadeddata';
      var timeout;
      function finish(success) {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        media.removeEventListener(successEvent, loaded);
        media.removeEventListener('error', failed);
        resolve(success);
      }
      function loaded() { finish(image ? media.naturalWidth > 0 : media.readyState >= 2); }
      function failed() { finish(false); }
      media.addEventListener(successEvent, loaded);
      media.addEventListener('error', failed);
      timeout = setTimeout(failed, 10000);
      if (image) media.loading = 'eager';
      else {
        media.preload = 'auto';
        if (media.readyState === 0) media.load();
      }
    });
  }
  function reviewReady(state, index) {
    var media = Array.from(state.slides[index].querySelectorAll('.verified-review__media img,.verified-review__media video'));
    // A late load can recover after the bounded wait timed out.
    if (media.every(function (item) { return item.tagName === 'IMG' ? item.complete && item.naturalWidth > 0 : item.readyState >= 2; })) return Promise.resolve(true);
    if (!state.loading[index]) {
      state.loading[index] = Promise.all(media.map(mediaReady)).then(function (ready) {
        return ready.every(Boolean);
      });
    }
    return state.loading[index];
  }
  function updateControls(state) {
    var total = state.slides.length;
    if (state.count) state.count.textContent = (state.index + 1) + ' / ' + total;
    if (state.toggle) {
      state.toggle.disabled = total < 2 || reduced.matches;
      state.toggle.setAttribute('aria-pressed', String(!state.userPaused && !reduced.matches && total > 1));
      state.toggle.textContent = reduced.matches || total < 2 ? '자동 넘김 꺼짐' : state.userPaused ? '자동 넘김 켜기' : '자동 넘김 끄기';
      state.toggle.setAttribute('aria-label', '후기 ' + state.toggle.textContent);
    }
    [state.previous, state.next].forEach(function (button) { if (button) button.disabled = total < 2; });
  }
  function activate(state, index, manual) {
    state.index = index;
    state.slides.forEach(function (slide, number) {
      var active = number === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      if (active) slide.removeAttribute('inert'); else slide.setAttribute('inert', '');
      // Keep inactive links out of the tab order even in browsers without inert.
      state.focusable[number].forEach(function (item) {
        if (!active) item.node.setAttribute('tabindex', '-1');
        else if (item.tabindex === null) item.node.removeAttribute('tabindex');
        else item.node.setAttribute('tabindex', item.tabindex);
      });
    });
    updateControls(state);
    if (manual) state.status.textContent = (index + 1) + ' / ' + state.slides.length + '번째 후기';
    syncMedia(state);
  }
  function sync(state) {
    if (state.busy && !state.navigationManual && !canRotate(state)) cancelPending(state);
    stopTimer(state);
    syncMedia(state);
    updateControls(state);
    if (!canRotate(state) || state.busy) return;
    reviewReady(state, (state.index + 1) % state.slides.length);
    state.timer = setTimeout(function () { move(state, 1, false); }, interval);
  }
  function cancelPending(state) {
    state.request += 1;
    state.busy = false;
    state.stage.removeAttribute('aria-busy');
    stopTimer(state);
  }
  async function move(state, step, manual, destination) {
    if (state.busy || state.slides.length < 2) return;
    stopTimer(state);
    var candidate = destination === undefined ? (state.index + step + state.slides.length) % state.slides.length : destination;
    if (manual) state.explicitRun = false;
    if (candidate === state.index) { sync(state); return; }
    var request = ++state.request;
    state.busy = true;
    state.navigationManual = manual;
    state.stage.setAttribute('aria-busy', 'true');
    if (manual) state.status.textContent = '다음 후기를 불러오는 중입니다.';
    // Keep the current card visible while loading; skip a failed photo rather
    // than cross-fading to an empty rectangle or borrowing another review's photo.
    for (var attempt = 0; attempt < state.slides.length - 1; attempt += 1) {
      if (candidate === state.index) break;
      var ready = await reviewReady(state, candidate);
      if (request !== state.request) return;
      if (!manual && !canRotate(state)) break;
      if (ready) { activate(state, candidate, manual); break; }
      candidate = (candidate + step + state.slides.length) % state.slides.length;
    }
    if (request !== state.request) return;
    state.busy = false;
    state.stage.removeAttribute('aria-busy');
    if (manual && state.status.textContent === '다음 후기를 불러오는 중입니다.') state.status.textContent = '사진을 불러오지 못했습니다. 현재 후기를 계속 보여드립니다.';
    sync(state);
  }

  document.querySelectorAll('.review-deck[data-review-designer]').forEach(function (deck, number) {
    var stage = deck.querySelector('.review-deck__stage');
    if (!stage || deck.classList.contains('review-deck--ready')) return;
    var slides = Array.from(stage.querySelectorAll('.verified-review[data-review-index]'));
    if (!slides.length) return;
    var heading = deck.querySelector('.review-deck__heading');
    if (heading) {
      if (!heading.id) heading.id = 'review-deck-heading-' + number;
      deck.setAttribute('aria-labelledby', heading.id);
    }
    deck.setAttribute('role', 'region');
    deck.setAttribute('aria-roledescription', '후기 모음');
    stage.setAttribute('aria-live', 'off');
    if (!stage.id) stage.id = 'review-deck-stage-' + number;
    var status = document.createElement('span');
    status.className = 'review-deck__status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    deck.appendChild(status);
    var state = {deck:deck, stage:stage, slides:slides, index:0, visible:false, hovered:false, focused:false,
      userPaused:false, explicitRun:false, busy:false, navigationManual:false, timer:null, request:0, loading:[], status:status,
      previous:deck.querySelector('.review-deck__prev'), next:deck.querySelector('.review-deck__next'),
      toggle:deck.querySelector('.review-deck__toggle'), count:deck.querySelector('.review-deck__count'),
      focusable:slides.map(function (slide) {
        return Array.from(slide.querySelectorAll('a[href],button,input,select,textarea,video[controls],[tabindex]')).map(function (node) {
          return {node:node, tabindex:node.getAttribute('tabindex')};
        });
      })};
    decks.push(state);
    [state.previous, state.next, state.toggle].forEach(function (button) { if (button) button.setAttribute('aria-controls', stage.id); });
    if (state.previous && !state.previous.getAttribute('aria-label')) state.previous.setAttribute('aria-label', '이전 후기');
    if (state.next && !state.next.getAttribute('aria-label')) state.next.setAttribute('aria-label', '다음 후기');
    slides.forEach(function (slide, index) {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', (index + 1) + ' / ' + slides.length + '번째 후기');
      slide.querySelectorAll('video').forEach(function (video) {
        video.muted = true; video.defaultMuted = true; video.playsInline = true; video.loop = true;
        video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
        video.removeAttribute('autoplay'); video.pause();
      });
    });
    activate(state, 0, false);
    deck.classList.add('review-deck--ready');
    // Every card now occupies the same grid cell. Its content still determines
    // the maximum stage height, so a longer quotation does not move the page.
    slides.forEach(function (slide) { slide.hidden = false; });
    if (state.previous) state.previous.addEventListener('click', function () { move(state, -1, true); });
    if (state.next) state.next.addEventListener('click', function () { move(state, 1, true); });
    if (state.toggle) state.toggle.addEventListener('click', function () {
      state.userPaused = !state.userPaused;
      // An explicit restart also works while this button retains touch/keyboard focus.
      state.explicitRun = !state.userPaused;
      sync(state);
    });
    var controls = deck.querySelector('.review-deck__controls');
    if (controls) controls.addEventListener('keydown', function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(state, -1, true); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); move(state, 1, true); }
      else if (event.key === 'Home') { event.preventDefault(); move(state, 1, true, 0); }
      else if (event.key === 'End') { event.preventDefault(); move(state, -1, true, slides.length - 1); }
    });
    deck.addEventListener('mouseenter', function () { if (hover.matches) { state.hovered = true; state.explicitRun = false; sync(state); } });
    deck.addEventListener('mouseleave', function () { state.hovered = false; sync(state); });
    deck.addEventListener('focusin', function () { state.focused = true; state.explicitRun = false; sync(state); });
    deck.addEventListener('focusout', function (event) {
      if (event.relatedTarget && deck.contains(event.relatedTarget)) return;
      state.focused = false; sync(state);
    });
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var state = decks.find(function (item) { return item.stage === entry.target; });
        if (!state) return;
        state.visible = entry.isIntersecting && entry.intersectionRatio >= .1;
        if (!state.visible) cancelPending(state);
        sync(state);
      });
    }, {threshold:[0, .1]});
    decks.forEach(function (state) { observer.observe(state.stage); });
  } else {
    var frame = null;
    function measureVisibility() {
      frame = null;
      decks.forEach(function (state) {
        var rect = state.stage.getBoundingClientRect();
        var visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        var visible = rect.right > 0 && rect.left < window.innerWidth && visibleHeight >= Math.min(rect.height * .1, 100);
        if (visible === state.visible) return;
        state.visible = visible;
        if (!visible) cancelPending(state);
        sync(state);
      });
    }
    function queueVisibility() { if (frame === null) frame = requestAnimationFrame(measureVisibility); }
    window.addEventListener('scroll', queueVisibility, {passive:true});
    window.addEventListener('resize', queueVisibility);
    measureVisibility();
  }
  function syncAll() { decks.forEach(function (state) { if (document.hidden || suspended) cancelPending(state); sync(state); }); }
  document.addEventListener('visibilitychange', syncAll);
  window.addEventListener('pagehide', function () { suspended = true; syncAll(); });
  window.addEventListener('pageshow', function () { suspended = false; syncAll(); });
  if (reduced.addEventListener) reduced.addEventListener('change', syncAll);
  else if (reduced.addListener) reduced.addListener(syncAll);
})();
