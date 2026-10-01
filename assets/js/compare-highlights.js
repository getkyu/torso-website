// Each overlay was checked against this exact AFTER image and the homepage's
// existing scale/translation. Do not copy these coordinates to other cases.
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var annotations = {
    ba10: {
      source: 'ba10_after.webp',
      points: [
        {text:'가볍게 흐르는 앞머리', position:'top-left', kind:'arrow', path:'M48 29 Q62 30 73 43'},
        {text:'또렷한 귀 주변', position:'bottom-left', kind:'ring', ellipse:[26,60,9,11]}
      ]
    },
    ba07: {
      source: 'ba07_after.webp',
      points: [
        {text:'뒤로 흐르는 결', position:'top-left', kind:'arrow', path:'M29 34 C41 27 56 28 69 37'},
        {text:'정돈된 귀 주변', position:'bottom-right', kind:'contour', path:'M54 75 C54 68 59 64 66 63 Q73 62 77 68'}
      ]
    },
    ba03: {
      source: 'ba03_after.webp',
      points: [
        {text:'둥근 윗머리', position:'top-left', kind:'contour', path:'M13 29 C20 17 50 13 75 23'},
        {text:'옆으로 흐르는 앞머리', position:'bottom-right', kind:'arrow', path:'M43 54 Q32 62 21 60'}
      ]
    }
  };
  var states = [];
  function svgElement(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    return node;
  }
  function makePoint(point, id) {
    var container = document.createElement('div');
    container.className = 'compare-highlight compare-highlight--' + point.kind;
    var svg = svgElement('svg', {viewBox:'0 0 100 100', preserveAspectRatio:'none', 'aria-hidden':'true', focusable:'false'});
    var drawing;
    if (point.ellipse) {
      drawing = svgElement('ellipse', {cx:point.ellipse[0], cy:point.ellipse[1], rx:point.ellipse[2], ry:point.ellipse[3], pathLength:'1'});
    } else {
      drawing = svgElement('path', {d:point.path, pathLength:'1'});
      if (point.kind === 'arrow') {
        var defs = svgElement('defs');
        var marker = svgElement('marker', {id:id, markerWidth:'5', markerHeight:'5', viewBox:'0 0 5 5', refX:'4.2', refY:'2.5', orient:'auto', markerUnits:'strokeWidth'});
        marker.appendChild(svgElement('path', {d:'M.6 .6 L4.2 2.5 .6 4.4', fill:'none', stroke:'currentColor', 'stroke-width':'1', 'stroke-linecap':'round', 'stroke-linejoin':'round'}));
        defs.appendChild(marker); svg.appendChild(defs);
        drawing.setAttribute('marker-end', 'url(#' + id + ')');
      }
    }
    drawing.setAttribute('class', 'compare-highlight__trace');
    drawing.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(drawing); container.appendChild(svg);
    var label = document.createElement('span');
    label.className = 'compare-highlight__label compare-highlight__label--' + point.position;
    label.textContent = point.text;
    container.appendChild(label);
    return container;
  }
  function clear(state) {
    state.timers.forEach(clearTimeout); state.timers = [];
    state.points.forEach(function (point) { point.classList.remove('is-shown'); });
  }
  function sync(state, force) {
    var after = state.box.getAttribute('data-compare-state') === 'after' && !document.hidden;
    if (!force && after === state.after) return;
    state.after = after; clear(state);
    if (!after) return;
    // Let the 400ms photograph dissolve finish before annotating its result.
    state.points.forEach(function (point, index) {
      state.timers.push(setTimeout(function () {
        if (state.box.getAttribute('data-compare-state') === 'after' && !document.hidden) point.classList.add('is-shown');
      }, reduced.matches ? 400 : 400 + index * 300));
    });
  }
  document.querySelectorAll('.case-compare--auto[data-case]').forEach(function (box, index) {
    var config = annotations[box.getAttribute('data-case')];
    var media = box.querySelector('.case-compare__media');
    var photo = box.querySelector('.case-compare__after');
    if (!config || !media || !photo || media.querySelector('.compare-highlights')) return;
    var file = (photo.getAttribute('src') || '').split(/[?#]/)[0].split('/').pop();
    if (file !== config.source) return;
    var overlay = document.createElement('div');
    overlay.className = 'compare-highlights'; overlay.setAttribute('aria-hidden', 'true');
    var points = config.points.slice(0, 2).map(function (point, number) {
      var element = makePoint(point, 'compare-arrow-' + index + '-' + number);
      overlay.appendChild(element); return element;
    });
    media.appendChild(overlay);
    // Provide one stable description, rather than repeatedly announcing the loop.
    var description = document.createElement('span');
    description.className = 'sr-only'; description.id = 'compare-description-' + index;
    description.textContent = '시술 후 살펴볼 부분: ' + config.points.map(function (point) { return point.text; }).join(', ') + '.';
    box.appendChild(description);
    var describedBy = (box.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    describedBy.push(description.id); box.setAttribute('aria-describedby', describedBy.join(' '));
    var state = {box:box, points:points, timers:[], after:null}; states.push(state);
    if ('MutationObserver' in window) {
      var observer = new MutationObserver(function () { sync(state, false); });
      observer.observe(box, {attributes:true, attributeFilter:['data-compare-state']});
    }
    sync(state, false);
  });
  document.addEventListener('visibilitychange', function () { states.forEach(function (state) { sync(state, true); }); });
  window.addEventListener('pageshow', function () { states.forEach(function (state) { sync(state, true); }); });
  window.addEventListener('pagehide', function () { states.forEach(clear); });
  function preferenceChanged() { states.forEach(function (state) { sync(state, true); }); }
  if (reduced.addEventListener) reduced.addEventListener('change', preferenceChanged);
  else if (reduced.addListener) reduced.addListener(preferenceChanged);
})();
