/* First-visit guidance has no calendar-based expiry. Booking rules remain in Naver. */
(function () {
  'use strict';
  document.querySelectorAll('[data-oct-offer]').forEach(function (el) {
    el.hidden = false;
  });
})();
