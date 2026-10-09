(function () {
  'use strict';
  if (!document.body.classList.contains('style-archive') ||
      !window.HTMLDialogElement || !HTMLDialogElement.prototype.showModal) return;

  var dialog = document.createElement('dialog');
  dialog.className = 'style-viewer';
  dialog.setAttribute('aria-labelledby', 'style-viewer-title');
  dialog.innerHTML = '<header class="style-viewer__head">' +
    '<h2 class="style-viewer__title" id="style-viewer-title">스타일 크게 보기</h2>' +
    '<button class="style-viewer__play" type="button" hidden>멈춤</button>' +
    '<button class="style-viewer__framing" type="button" hidden>원본 전체</button>' +
    '<button class="style-viewer__close" type="button" aria-label="스타일 크게 보기 닫기">닫기 ×</button></header>' +
    '<div class="style-viewer__stage"></div>' +
    '<footer class="style-viewer__foot"><div class="style-viewer__paging">' +
    '<button class="style-viewer__step" type="button" data-step="-1" aria-label="이전 사진 또는 영상">‹</button>' +
    '<span class="style-viewer__count"></span>' +
    '<button class="style-viewer__step" type="button" data-step="1" aria-label="다음 사진 또는 영상">›</button></div>' +
    '<a class="style-viewer__book" target="_blank" rel="noopener">담당자 예약</a></footer>' +
    '<p class="style-viewer__status" aria-live="polite" aria-atomic="true"></p>';
  document.body.appendChild(dialog);
  var stage = dialog.querySelector('.style-viewer__stage');
  var title = dialog.querySelector('.style-viewer__title');
  var count = dialog.querySelector('.style-viewer__count');
  var book = dialog.querySelector('.style-viewer__book');
  var closeButton = dialog.querySelector('.style-viewer__close');
  var framingButton = dialog.querySelector('.style-viewer__framing');
  var playButton = dialog.querySelector('.style-viewer__play');
  var previous = dialog.querySelector('[data-step="-1"]');
  var next = dialog.querySelector('[data-step="1"]');
  var status = dialog.querySelector('.style-viewer__status');
  var items = [], current = 0, opener = null, playingBefore = [], savedScroll = 0, bodyStyle = null;
  var currentFraming = null, framed = false;
  // Only the first texture-cut film has a reviewed, customer-centred crop.
  // Keep all unreviewed originals intact; never infer a crop from a face detector.
  var reviewedFraming = {
    '/assets/video/process/finish.mp4': { scale: 2, origin: '50% 65%' }
  };

  function updatePlayButton() {
    var video = stage.querySelector('video');
    playButton.hidden = !video || !framed;
    if (!video) return;
    playButton.textContent = video.paused ? '재생' : '멈춤';
    playButton.setAttribute('aria-label', video.paused ? '스타일 영상 재생' : '스타일 영상 일시정지');
  }
  function applyFraming() {
    stage.classList.toggle('is-framed', framed);
    framingButton.hidden = !currentFraming;
    framingButton.textContent = framed ? '원본 전체' : '머리 중심';
    framingButton.setAttribute('aria-label', framed ? '원본 전체 보기' : '머리 중심으로 보기');
    stage.style.setProperty('--style-viewer-scale', currentFraming ? currentFraming.scale : 1);
    stage.style.setProperty('--style-viewer-origin', currentFraming ? currentFraming.origin : '50% 50%');
    var video = stage.querySelector('video');
    if (video) video.controls = !framed;
    updatePlayButton();
  }

  function mediaOf(tile) {
    return Array.from(tile.querySelectorAll('.style-card-media img, .style-card-media video'));
  }
  function stopStage() {
    var video = stage.querySelector('video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    stage.replaceChildren();
  }
  function showItem() {
    stopStage();
    var item = items[current], source = item.source;
    var media = document.createElement(source.tagName.toLowerCase());
    currentFraming = reviewedFraming[new URL(source.currentSrc || source.getAttribute('src'), document.baseURI).pathname] || null;
    framed = !!currentFraming;
    title.textContent = item.name;
    count.textContent = (current + 1) + ' / ' + items.length;
    previous.disabled = current === 0;
    next.disabled = current === items.length - 1;
    book.hidden = !item.booking;
    if (item.booking) {
      book.href = item.booking.href;
      book.textContent = item.booking.textContent.trim().replace(/^✂︎\s*/, '');
    }
    if (source.tagName === 'VIDEO') {
      media.muted = true;
      media.defaultMuted = true;
      media.playsInline = true;
      media.controls = true;
      media.loop = true;
      media.preload = 'metadata';
      media.setAttribute('muted', '');
      media.setAttribute('playsinline', '');
      media.setAttribute('aria-label', source.getAttribute('aria-label') || item.name + ' 시술 영상');
      media.addEventListener('play', updatePlayButton);
      media.addEventListener('pause', updatePlayButton);
      if (source.poster) media.poster = source.poster;
      var time = source.currentTime;
      if (Number.isFinite(time) && time > 0) {
        media.addEventListener('loadedmetadata', function () {
          if (Number.isFinite(media.duration) && time < media.duration) media.currentTime = time;
        }, { once: true });
      }
    } else {
      media.alt = source.alt || item.name + ' 실제 시술 사진';
      media.decoding = 'async';
    }
    media.src = source.currentSrc || source.getAttribute('src');
    stage.appendChild(media);
    applyFraming();
    if (source.tagName === 'VIDEO') media.play().catch(function () {});
    status.textContent = item.name + ', ' + items.length + '개 중 ' + (current + 1) + '번째 ' +
      (source.tagName === 'VIDEO' ? '영상' : '사진');
  }
  function openViewer(tile, trigger) {
    if (dialog.open) return;
    var group = tile.closest('.smedia');
    items = [];
    group.querySelectorAll('.vitem').forEach(function (card) {
      var label = card.querySelector('.vitem__tag');
      mediaOf(card).forEach(function (media) {
        items.push({ source: media, name: label ? label.textContent.trim() : '스타일',
          booking: card.querySelector('.vitem__book') });
      });
    });
    var selected = mediaOf(tile).reduce(function (best, media) {
      return !best || Number(getComputedStyle(media).opacity) > Number(getComputedStyle(best).opacity) ? media : best;
    }, null);
    if (!selected || !items.length) return;
    current = items.findIndex(function (item) { return item.source === selected; });
    opener = trigger;
    savedScroll = window.scrollY;
    bodyStyle = { position: document.body.style.position, top: document.body.style.top,
      width: document.body.style.width };
    playingBefore = Array.from(document.querySelectorAll('video')).filter(function (video) { return !video.paused; });
    playingBefore.forEach(function (video) { video.pause(); });
    document.documentElement.classList.add('style-viewer-open');
    document.body.style.position = 'fixed';
    document.body.style.top = -savedScroll + 'px';
    document.body.style.width = '100%';
    dialog.showModal();
    showItem();
    closeButton.focus({ preventScroll: true });
  }
  function move(step) {
    var index = current + step;
    if (index >= 0 && index < items.length) { current = index; showItem(); }
  }
  closeButton.addEventListener('click', function () { dialog.close(); });
  framingButton.addEventListener('click', function () {
    if (!currentFraming) return;
    framed = !framed;
    applyFraming();
  });
  playButton.addEventListener('click', function () {
    var video = stage.querySelector('video');
    if (!video) return;
    if (video.paused) video.play().catch(function () {}); else video.pause();
  });
  previous.addEventListener('click', function () { move(-1); });
  next.addEventListener('click', function () { move(1); });
  dialog.addEventListener('keydown', function (event) {
    // Let the native video controls keep their arrow-key seeking/volume behavior.
    if (event.target.tagName === 'VIDEO') return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  dialog.addEventListener('close', function () {
    stopStage();
    document.documentElement.classList.remove('style-viewer-open');
    if (bodyStyle) {
      document.body.style.position = bodyStyle.position;
      document.body.style.top = bodyStyle.top;
      document.body.style.width = bodyStyle.width;
      window.scrollTo(0, savedScroll);
    }
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    playingBefore.forEach(function (video) {
      var rect = video.getBoundingClientRect();
      if (!document.hidden && rect.bottom > 0 && rect.top < window.innerHeight) video.play().catch(function () {});
    });
    items = []; playingBefore = []; bodyStyle = null;
  });
  // Intersection-driven thumbnails must stay quiet while a customer studies one case.
  document.addEventListener('play', function (event) {
    if (dialog.open && event.target.tagName === 'VIDEO' && !dialog.contains(event.target)) event.target.pause();
  }, true);

  document.querySelectorAll('.smedia .vitem').forEach(function (tile) {
    var frame = tile.querySelector('.style-card-media');
    if (!frame || !mediaOf(tile).length) return;
    var label = tile.querySelector('.vitem__tag');
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'style-viewer-trigger';
    trigger.setAttribute('aria-label', (label ? label.textContent.trim() : '스타일') + ' 크게 보기');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.innerHTML = '<span aria-hidden="true">크게 보기 ↗</span>';
    trigger.addEventListener('click', function () { openViewer(tile, trigger); });
    frame.appendChild(trigger);
  });
})();
