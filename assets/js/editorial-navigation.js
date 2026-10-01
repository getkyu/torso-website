// Shared branch identity and keyboard support for the existing scissors menu.
(function () {
  'use strict';
  var header = document.querySelector('.nav');
  if (!header || header.dataset.editorialNavigation === 'ready') return;
  header.dataset.editorialNavigation = 'ready';

  var logo = header.querySelector('.nav__logo');
  if (logo && !logo.querySelector('.nav__branch')) {
    var branch = document.createElement('span');
    branch.className = 'nav__branch';
    branch.textContent = '홍대 · 상수역점';
    logo.appendChild(branch);
    logo.classList.add('nav__logo--branch');
  }

  var menu = header.querySelector('.nav__nav');
  var burger = header.querySelector('.nav__burger');
  if (!menu || !burger) return;
  var list = menu.querySelector('.nav__menu--l');
  var philosophy = menu.querySelector('a[href="philosophy.html"]');
  if (list && !philosophy) {
    var item = document.createElement('li');
    item.className = 'nav__mobile-philosophy';
    philosophy = document.createElement('a');
    philosophy.href = 'philosophy.html';
    philosophy.textContent = '브랜드 철학';
    item.appendChild(philosophy);
    list.appendChild(item);
  }
  if (philosophy && /\/philosophy\.html$/.test(window.location.pathname)) {
    philosophy.classList.add('active');
    philosophy.setAttribute('aria-current', 'page');
  }
  if (!menu.id) menu.id = 'torso-primary-menu';
  burger.setAttribute('aria-controls', menu.id);

  var mobile = window.matchMedia('(max-width:900px)');
  var inertNodes = [];
  function isOpen() { return mobile.matches && document.body.classList.contains('menu-open'); }
  function restorePage() {
    inertNodes.forEach(function (node) { node.removeAttribute('inert'); });
    inertNodes = [];
  }
  function sync() {
    var open = isOpen();
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    if (!open) { restorePage(); return; }
    Array.from(document.body.children).forEach(function (node) {
      if (node === header || node.contains(header) || /^(SCRIPT|STYLE|LINK|SVG)$/.test(node.tagName) || node.hasAttribute('inert')) return;
      node.setAttribute('inert', '');
      inertNodes.push(node);
    });
  }
  function close(returnFocus) {
    document.body.classList.remove('menu-open');
    sync();
    if (returnFocus) burger.focus({preventScroll:true});
  }
  function focusable() {
    return Array.from(header.querySelectorAll('a[href], button:not([disabled])')).filter(function (node) {
      return node.getClientRects().length && node.tabIndex >= 0;
    });
  }

  // main.js owns the toggle; this listener runs after it and only adds semantics.
  burger.addEventListener('click', function () {
    sync();
    if (isOpen()) {
      var first = menu.querySelector('a[href]');
      if (first) first.focus({preventScroll:true});
    }
  });
  // Delegation also covers the new philosophy link added after main.js initialized.
  menu.addEventListener('click', function (event) {
    if (event.target.closest('a[href]')) close(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && (isOpen() || inertNodes.length)) { event.preventDefault(); close(true); return; }
    if (!isOpen()) return;
    if (event.key !== 'Tab') return;
    var links = focusable();
    if (!links.length) return;
    var first = links[0], last = links[links.length - 1], active = document.activeElement;
    if (event.shiftKey && (active === first || !header.contains(active))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (active === last || !header.contains(active))) {
      event.preventDefault(); first.focus();
    }
  });
  function onResize() { if (!mobile.matches) close(false); }
  if (mobile.addEventListener) mobile.addEventListener('change', onResize);
  else mobile.addListener(onResize);
  window.addEventListener('pagehide', function () { close(false); });
  window.addEventListener('pageshow', sync);
  sync();
})();
