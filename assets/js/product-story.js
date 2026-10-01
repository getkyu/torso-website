// Native scrolling: no scroll interception, extra pinned screens, or media seeking.
(function () {
  'use strict';
  if (!document.body.classList.contains('product-story')) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hero = document.querySelector('.consult-hero--cinema');
  var selector = '.j-heading, .j-case, .j-core-grid>a, .j-process-grid>article, .journey-designer, .journey-price-sheet, .j-booking-paths__grid>div';
  var elements = Array.from(document.querySelectorAll(selector));
  var observer, frame = 0;
  function revealAll() {
    elements.forEach(function (el) { el.classList.add('is-revealed'); });
    if (observer) observer.disconnect();
  }
  if (!reduced.matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, {threshold:0, rootMargin:'0px 0px -24px 0px'});
    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      // In-view content and hash destinations remain immediately readable.
      if (rect.top < window.innerHeight) return;
      var siblings = Array.from(el.parentElement.children);
      var grouped = el.parentElement.matches('.j-case-grid,.j-core-grid,.j-process-grid,.designer-puzzle,.j-booking-paths__grid');
      if (grouped) el.style.setProperty('--story-delay', Math.min(siblings.indexOf(el) * 70, 210) + 'ms');
      el.classList.add('story-reveal');
      observer.observe(el);
    });
  }
  function renderHero() {
    frame = 0;
    if (!hero || reduced.matches) return;
    var rect = hero.getBoundingClientRect();
    if (rect.bottom < 0) return;
    var progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height * .75)));
    var mobile = window.innerWidth <= 700;
    hero.style.setProperty('--story-inset', (progress * (mobile ? 8 : 28)).toFixed(2) + 'px');
    hero.style.setProperty('--story-radius', (progress * (mobile ? 18 : 32)).toFixed(2) + 'px');
    hero.style.setProperty('--story-copy-y', (progress * (mobile ? 8 : 20)).toFixed(2) + 'px');
  }
  function requestRender() {
    if (!frame && !document.hidden && !reduced.matches) frame = requestAnimationFrame(renderHero);
  }
  window.addEventListener('scroll', requestRender, {passive:true});
  window.addEventListener('resize', requestRender, {passive:true});
  window.addEventListener('pageshow', requestRender);
  document.addEventListener('visibilitychange', requestRender);
  // Keyboard focus must never land inside an invisible reveal target.
  document.addEventListener('focusin', function (event) {
    var target = event.target.closest('.story-reveal');
    if (target) target.classList.add('is-revealed');
  });
  function preferenceChanged() {
    if (reduced.matches) {
      revealAll(); cancelAnimationFrame(frame); frame = 0;
      if (hero) ['--story-inset','--story-radius','--story-copy-y'].forEach(function (key) { hero.style.removeProperty(key); });
    } else requestRender();
  }
  if (reduced.addEventListener) reduced.addEventListener('change', preferenceChanged);
  else reduced.addListener(preferenceChanged);
  requestRender();
})();
