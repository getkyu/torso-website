// Identify platform destinations without changing their URLs or visible labels.
(function () {
  'use strict';
  if (!document.body || document.documentElement.dataset.brandLinksReady) return;
  document.documentElement.dataset.brandLinksReady = 'true';
  var NS = 'http://www.w3.org/2000/svg';
  var iconCount = 0;
  var bookingDesigners = {
    '3696795': {name: '진성', key: 'jinsung'},
    '6961265': {name: '준영', key: 'junyoung'},
    '6826157': {name: '진훈', key: 'jinhoon'}
  };

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
    } else if (brand === 'talk') {
      svg.appendChild(element('path', {d:'M12 2C6.5 2 2 5.8 2 10.5c0 2.6 1.4 4.9 3.6 6.4L5 22l5-3.2c.7.1 1.3.2 2 .2 5.5 0 10-3.8 10-8.5S17.5 2 12 2z',fill:'currentColor'}));
      [7,12,17].forEach(function (x) {svg.appendChild(element('circle',{cx:String(x),cy:'10.5',r:'1.2',fill:'#fff'}));});
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

  function decorateDesigner(link, destination) {
    var match = destination.pathname.match(/\/items\/(\d+)(?:\/|$)/);
    var person = match && bookingDesigners[match[1]];
    if (!person) return;
    link.classList.add('booking-designer-link');
    link.dataset.bookingDesigner = person.key;
    if (link.querySelector('.booking-designer-name')) return;
    var texts = [], walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.indexOf(person.name) < 0 || !node.parentElement ||
          node.parentElement.closest('svg, .brand-link-icon, .booking-designer-name, [aria-hidden="true"]')) continue;
      texts.push(node);
    }
    texts.forEach(function (text) {
      // Keep the original wording in one flex item; only the name receives colour.
      var copy = document.createElement('span');
      copy.className = 'booking-link-copy';
      text.nodeValue.split(person.name).forEach(function (part, index) {
        if (index) {
          var name = document.createElement('span');
          name.className = 'booking-designer-name';
          name.textContent = person.name;
          copy.appendChild(name);
        }
        if (part) copy.appendChild(document.createTextNode(part));
      });
      text.replaceWith(copy);
    });
  }

  function decorate(link) {
    var destination;
    try { destination = new URL(link.getAttribute('href'), document.baseURI); }
    catch (_) { return; }
    if (destination.protocol !== 'https:' && destination.protocol !== 'http:') return;
    var host = destination.hostname.toLowerCase();
    var brand = host === 'booking.naver.com' ? 'naver' :
      host === 'talk.naver.com' ? 'talk' :
      (host === 'instagram.com' || host === 'www.instagram.com') ? 'instagram' :
      (host === 'youtube.com' || host === 'www.youtube.com' || host === 'youtu.be') ? 'youtube' :
      (host === 'blog.naver.com' || host === 'm.blog.naver.com') ? 'blog' : '';
    if (!brand) return;
    if (brand === 'naver') decorateDesigner(link, destination);

    // Platform colour belongs to the designer's external links, not the whole site.
    if (link.closest('.desg')) {
      link.classList.add('platform-link', 'platform-link--' + brand);
      if (brand === 'blog' && link.getAttribute('aria-label') === 'Blog') {
        link.setAttribute('aria-label', '네이버 블로그');
      }
    }
    if (link.querySelector('.sns-ico, .brand-link-icon')) return;
    if (brand !== 'naver' && brand !== 'instagram' && brand !== 'talk') return;

    // Replace generic calendar/message symbols; preserve existing SNS logos and media cards.
    var existing = link.querySelector('svg.btn__ic');
    if (!existing && link.querySelector('svg, img')) return;
    var symbol = icon(brand);
    link.classList.add('brand-link', 'brand-link--' + brand);
    if (existing) existing.replaceWith(symbol);
    else link.insertBefore(symbol, link.firstChild);
  }

  function scan(root) {
    if (root.nodeType !== 1 && root.nodeType !== 3) return;
    var parent = root.nodeType === 1 ? root : root.parentElement;
    if (!parent) return;
    var owner = parent.closest('a[href]');
    if (owner) decorate(owner);
    if (root.nodeType !== 1) return;
    root.querySelectorAll('a[href]').forEach(decorate);
  }

  function markNpayLabels() {
    if (!document.body.classList.contains('price-comparison-page')) return;
    var texts = [], walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), node;
    while ((node = walker.nextNode())) {
      if (!/Npay|N페이|네이버페이/i.test(node.nodeValue) || !node.parentElement ||
          node.parentElement.closest('script, style, svg, .sr-only, .brand-npay, [aria-hidden="true"]')) continue;
      texts.push(node);
    }
    texts.forEach(function (text) {
      var fragment = document.createDocumentFragment();
      text.nodeValue.split(/(Npay|N페이|네이버페이)/gi).forEach(function (part, index) {
        if (index % 2) {
          var label = document.createElement('span');
          label.className = 'brand-npay'; label.textContent = part;
          fragment.appendChild(label);
        } else if (part) fragment.appendChild(document.createTextNode(part));
      });
      text.replaceWith(fragment);
    });
  }

  scan(document.body);
  markNpayLabels();
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
