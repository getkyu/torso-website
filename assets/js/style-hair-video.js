// 스타일 페이지: 영상 자동 재생 보강 + 스타일 선택 직후 첫 영상이 화면에 보이도록 위치 맞춤 (2026-10-20)
// - 영상은 소리 없이(muted·playsinline) 보이는 순간 자동 재생합니다. 동작 줄이기·저전력 설정이어도 막지 않습니다.
// - 브라우저가 자동 재생을 막으면 첫 터치·클릭·키 입력 때 보이는 영상만 다시 재생합니다.
// - 크게 보기(style-viewer.js)가 열려 있는 동안에는 건드리지 않습니다.
(function () {
  'use strict';
  if (!document.body.classList.contains('style-archive')) return;
  var videos = Array.prototype.slice.call(document.querySelectorAll('.smedia video'));
  var visible = new Set(), blocked = new Set();
  var root = document.documentElement;

  function viewerOpen() { return root.classList.contains('style-viewer-open'); }
  function silence(v) {
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
  }
  function attempt(v) {
    if (!visible.has(v) || document.hidden || viewerOpen() || !v.paused) return;
    silence(v);
    var p;
    try { p = v.play(); } catch (e) { blocked.add(v); return; }
    if (p && p.then) p.then(function () { blocked.delete(v); }).catch(function (e) {
      if (e && e.name === 'AbortError') return;
      blocked.add(v);
    });
  }
  function retryVisible() { visible.forEach(attempt); }

  videos.forEach(silence);
  if ('IntersectionObserver' in window) {
    // 화면 근처(위아래 400px)에 오면 미리 불러오고, 20% 이상 보이면 재생합니다.
    var near = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.target.preload !== 'auto') e.target.preload = 'auto';
      });
    }, { rootMargin: '400px 0px' });
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.2) { visible.add(v); attempt(v); }
        else { visible.delete(v); if (!v.paused && !viewerOpen()) v.pause(); }
      });
    }, { threshold: [0, 0.2, 0.5] });
    videos.forEach(function (v) { near.observe(v); seen.observe(v); v.addEventListener('canplay', function () { attempt(v); }); v.addEventListener('loadeddata', function () { attempt(v); }); });
  } else {
    videos.forEach(function (v) { visible.add(v); attempt(v); });
  }
  // 자동 재생이 막힌 경우: 사용자의 첫 동작(터치·클릭·키)에서 다시 시도
  ['touchstart', 'touchend', 'pointerdown', 'pointerup', 'click', 'keydown'].forEach(function (type) {
    document.addEventListener(type, function () { if (blocked.size) retryVisible(); }, { passive: true, capture: true });
  });
  document.addEventListener('visibilitychange', retryVisible);
  window.addEventListener('pageshow', retryVisible);
  // 크게 보기를 닫으면 화면에 보이는 영상을 다시 재생
  document.addEventListener('close', function (e) { if (e.target && e.target.classList && e.target.classList.contains('style-viewer')) setTimeout(retryVisible, 60); }, true);

  // ---- 스타일을 누른 직후(휴대폰): 첫 영상이 스크롤 없이 보이게 위치 맞춤 ----
  // 홈에서 코어(#core-...)를 눌러 들어오거나 메뉴의 '스타일'로 들어오면, 해당 코어의 첫 영상 칸이
  // 화면에 충분히 들어오도록 한 번만 위치를 잡습니다. 새로고침·뒤로가기로 이미 스크롤된 경우는 건드리지 않습니다.
  // 처음 보이는 코어(홈에서 누른 코어, 없으면 첫 코어)의 첫 영상은 바로 불러옵니다.
  (function eager() {
    var t = null;
    if (location.hash.length > 1) { try { t = document.querySelector(location.hash); } catch (e) { t = null; } }
    var first = (t || document.querySelector('.style-core') || document).querySelector('.smedia video');
    if (first) first.preload = 'auto';
  })();
  function place() {
    if (!window.matchMedia('(max-width:700px)').matches) return;
    var nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
    if (nav.type === 'reload' || nav.type === 'back_forward') return;
    var target = null;
    if (location.hash.length > 1) { try { target = document.querySelector(location.hash); } catch (e) { target = null; } }
    // 원장님 결정(10/20): 메뉴 '스타일'로 들어오면(해시 없음) 맨 위 배너를 그대로 보여 주고 자동 이동하지 않습니다.
    if (!target) return;
    var scope = target || document.querySelector('.style-core');
    var first = scope && scope.querySelector('.smedia .style-card-media');
    if (!first) return;
    var rect = first.getBoundingClientRect(), vh = window.innerHeight;
    // 이미 첫 영상 칸이 화면 안에 충분히(75% 이상) 들어와 있으면 그대로 둡니다.
    var shown = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    if (shown >= rect.height * 0.75) return;
    var head = (scope.classList.contains('style-core') ? scope : scope.closest('.style-core')) || scope;
    var navH = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 76;
    var y = head.getBoundingClientRect().top + window.scrollY - navH - 6;
    var old = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, Math.max(0, y));
    root.style.scrollBehavior = old;
  }
  if (document.readyState === 'complete') setTimeout(place, 0); else window.addEventListener('load', function () { setTimeout(place, 0); });
})();
