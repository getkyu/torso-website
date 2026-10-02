/* Display-only campaign dates. Booking and payment rules remain in Naver. */
(function () {
  'use strict';
  var startsAt = Date.parse('2026-10-02T00:00:00+09:00');
  var endsAt = Date.parse('2026-11-01T00:00:00+09:00');
  var timer;

  function updateOffer() {
    var now = Date.now();
    var active = now >= startsAt && now < endsAt;
    document.querySelectorAll('[data-oct-offer]').forEach(function (el) {
      el.hidden = !active;
    });
    document.querySelectorAll('[data-oct-standard]').forEach(function (el) {
      el.hidden = active;
    });
    document.querySelectorAll('[data-oct-ended]').forEach(function (el) {
      el.hidden = now < endsAt;
    });
    document.querySelectorAll('[data-oct-promotion-description]').forEach(function (el) {
      el.setAttribute('content', active ? el.dataset.octPromotionDescription : el.dataset.octStandardDescription);
    });
    window.clearTimeout(timer);
    var next = now < startsAt ? startsAt : now < endsAt ? endsAt : null;
    if (next !== null) timer = window.setTimeout(updateOffer, Math.min(next - now + 1, 2147483647));
  }

  updateOffer();
  document.addEventListener('visibilitychange', updateOffer);
  window.addEventListener('focus', updateOffer);
})();
