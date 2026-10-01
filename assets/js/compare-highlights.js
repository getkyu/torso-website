// Each overlay was checked against these exact BEFORE/AFTER images and the homepage's
// existing scale/translation. Do not copy these coordinates to other cases.
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var annotations = {
    ba10: {
      before: {
        source: 'ba10_before.webp',
        points: [
          {text:'이마를 덮는 앞머리', position:'top-left', kind:'contour', path:'M44 49 Q61 48 69 51 Q76 50 82 48'},
          {text:'귀를 덮는 옆머리', position:'bottom-left', kind:'ring', ellipse:[27,53,12,8]}
        ]
      },
      after: {
        source: 'ba10_after.webp',
        points: [
          {text:'몽실몽실한 랜덤 컬', position:'top-left', kind:'contour', path:'M36 27 C30 30 32 38 38 37 S45 28 48 33 S46 43 53 40 S59 30 65 35'},
          {text:'컬이 만드는 입체감', position:'bottom-left', kind:'ring', ellipse:[33,37,17,15]}
        ]
      }
    },
    ba07: {
      before: {
        source: 'ba07_before.webp',
        points: [
          {text:'앞으로 향한 결', position:'top-left', kind:'arrow', path:'M53 32 Q36 29 18 42'},
          {text:'귀 위에 남은 무게', position:'bottom-right', kind:'ring', ellipse:[66,65,11,7]}
        ]
      },
      after: {
        source: 'ba07_after.webp',
        points: [
          {text:'뒤로 흐르는 결', position:'top-left', kind:'arrow', path:'M29 34 C41 27 56 28 69 37'},
          {text:'정돈된 귀 주변', position:'bottom-right', kind:'contour', path:'M54 75 C54 68 59 64 66 63 Q73 62 77 68'}
        ]
      }
    },
    ba03: {
      before: {
        source: 'ba03_before.webp',
        points: [
          {text:'앞으로 내려온 결', position:'top-left', kind:'arrow', path:'M32 27 Q26 40 20 53'},
          {text:'이마를 덮는 길이', position:'bottom-right', kind:'contour', path:'M13 68 Q27 76 45 75'}
        ]
      },
      after: {
        source: 'ba03_after.webp',
        points: [
          {text:'살아난 앞볼륨', position:'top-left', kind:'contour', path:'M9 52 C5 40 8 31 18 28'},
          {text:'옆으로 흐르는 앞머리', position:'bottom-right', kind:'arrow', path:'M43 54 Q32 62 21 60'}
        ]
      }
    }
  };
  var states = [];
  function svgElement(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    return node;
  }
  function makePoint(point, id, stage) {
    var container = document.createElement('div');
    container.className = 'compare-highlight compare-highlight--' + point.kind;
    container.setAttribute('data-compare-stage', stage);
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
    var stage = document.hidden ? null : state.box.getAttribute('data-compare-state');
    if (!force && stage === state.stage) return;
    state.stage = stage; clear(state);
    if (!state.byStage[stage]) return;
    // Annotate only the new photograph after its 400ms dissolve. Pausing the
    // comparison keeps its current marks; it does not start a separate loop.
    state.byStage[stage].forEach(function (point, index) {
      state.timers.push(setTimeout(function () {
        if (state.stage === stage && state.box.getAttribute('data-compare-state') === stage && !document.hidden) point.classList.add('is-shown');
      }, reduced.matches ? 400 : 400 + index * 300));
    });
  }
  document.querySelectorAll('.case-compare--auto[data-case]').forEach(function (box, index) {
    var config = annotations[box.getAttribute('data-case')];
    var media = box.querySelector('.case-compare__media');
    if (!config || !media || media.querySelector('.compare-highlights')) return;
    var stages = ['before', 'after'].filter(function (stage) {
      var photo = box.querySelector('.case-compare__' + stage);
      var file = photo && (photo.getAttribute('src') || '').split(/[?#]/)[0].split('/').pop();
      return file === config[stage].source;
    });
    if (!stages.length) return;
    var overlay = document.createElement('div');
    overlay.className = 'compare-highlights'; overlay.setAttribute('aria-hidden', 'true');
    var byStage = {}, points = [];
    stages.forEach(function (stage) {
      byStage[stage] = config[stage].points.slice(0, 2).map(function (point, number) {
        var element = makePoint(point, 'compare-arrow-' + index + '-' + stage + '-' + number, stage);
        overlay.appendChild(element); points.push(element); return element;
      });
    });
    media.appendChild(overlay);
    // Provide one stable description, rather than repeatedly announcing the loop.
    var description = document.createElement('span');
    description.className = 'sr-only'; description.id = 'compare-description-' + index;
    description.textContent = stages.map(function (stage) {
      return (stage === 'before' ? '시술 전' : '시술 후') + ' 살펴볼 부분: ' + config[stage].points.map(function (point) { return point.text; }).join(', ') + '.';
    }).join(' ');
    box.appendChild(description);
    var describedBy = (box.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    describedBy.push(description.id); box.setAttribute('aria-describedby', describedBy.join(' '));
    var state = {box:box, points:points, byStage:byStage, timers:[], stage:null}; states.push(state);
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
