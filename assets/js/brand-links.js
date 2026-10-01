// Identify platform destinations without changing their URLs or visible labels.
(function () {
  'use strict';
  if (!document.body || document.documentElement.dataset.brandLinksReady) return;
  document.documentElement.dataset.brandLinksReady = 'true';
  var NS = 'http://www.w3.org/2000/svg';
  var iconCount = 0;

  function element(name, attributes) {
    var node = document.createElementNS(NS, name);
    Object.keys(attributes).forEach(function (key) { node.setAttribute(key, attributes[key]); });
    return node;
  }

  function icon(brand) {
    var svg = element('svg', {
      'class': 'brand-link-icon brand-link-icon--' + brand,
      viewBox: '0 0 24 24', width: '14', height: '14',
      'aria-hidden': 'true', focusable: 'false'
    });
    if (brand === 'naver') {
      svg.appendChild(element('path', {
        d: 'M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z',
        fill: 'currentColor'
      }));
    } else {
      var gradientId = 'torso-instagram-' + (++iconCount);
      var defs = element('defs', {});
      var gradient = element('linearGradient', {id:gradientId, x1:'0', y1:'1', x2:'1', y2:'0'});
      [['0%','#ffb347'],['42%','#f64f59'],['72%','#d6249f'],['100%','#8a5cf6']].forEach(function (stop) {
        gradient.appendChild(element('stop', {offset:stop[0], 'stop-color':stop[1]}));
      });
      defs.appendChild(gradient); svg.appendChild(defs);
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'url(#' + gradientId + ')');
      svg.setAttribute('stroke-width', '1.8');
      svg.appendChild(element('rect', { x: '3', y: '3', width: '18', height: '18', rx: '5' }));
      svg.appendChild(element('circle', { cx: '12', cy: '12', r: '4' }));
      svg.appendChild(element('circle', { cx: '17.4', cy: '6.6', r: '1', fill: '#d6249f', stroke: 'none' }));
    }
    return svg;
  }

  function decorate(link) {
    var destination;
    try { destination = new URL(link.getAttribute('href'), document.baseURI); }
    catch (_) { return; }
    if (destination.protocol !== 'https:' && destination.protocol !== 'http:') return;
    var host = destination.hostname.toLowerCase();
    var brand = host === 'booking.naver.com' ? 'naver' :
      (host === 'instagram.com' || host === 'www.instagram.com') ? 'instagram' :
      (host === 'youtube.com' || host === 'www.youtube.com' || host === 'youtu.be') ? 'youtube' :
      (host === 'blog.naver.com' || host === 'm.blog.naver.com') ? 'blog' : '';
    if (!brand) return;

    // Platform colour belongs to the designer's external links, not the whole site.
    if (link.closest('.desg')) {
      link.classList.add('platform-link', 'platform-link--' + brand);
      if (brand === 'blog' && link.getAttribute('aria-label') === 'Blog') {
        link.setAttribute('aria-label', '네이버 블로그');
      }
    }
    if (link.querySelector('.sns-ico, .brand-link-icon')) return;
    if (brand !== 'naver' && brand !== 'instagram') return;

    // Replace generic calendar/message symbols; preserve existing SNS logos and media cards.
    var existing = link.querySelector('svg.btn__ic');
    if (!existing && link.querySelector('svg, img')) return;
    var symbol = icon(brand);
    link.classList.add('brand-link', 'brand-link--' + brand);
    if (existing) existing.replaceWith(symbol);
    else link.insertBefore(symbol, link.firstChild);
  }

  function scan(root) {
    if (root.nodeType !== 1) return;
    if (root.matches('a[href]')) decorate(root);
    root.querySelectorAll('a[href]').forEach(decorate);
  }

  scan(document.body);
  document.querySelectorAll('.desg .desg__disc').forEach(function (badge) {
    if (/Npay|N페이/i.test(badge.textContent)) badge.classList.add('brand-benefit--npay');
  });
  // Style galleries add reservation links when opened. Only inspect newly added nodes.
  if ('MutationObserver' in window) {
    new MutationObserver(function (records) {
      records.forEach(function (record) { record.addedNodes.forEach(scan); });
    }).observe(document.body, { childList: true, subtree: true });
  }
})();
