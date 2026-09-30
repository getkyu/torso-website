// Preserve the full original frame so the designer and client remain visible together.
// The source clips have different camera framing; no face or missing scene is generated.
(function () {
  document.querySelectorAll('.j-process-grid video').forEach(function (video) {
    if (video.closest('.process-frame')) return;
    var frame = document.createElement('div');
    frame.className = 'process-frame';
    video.parentNode.insertBefore(frame, video);
    frame.appendChild(video);
    video.removeAttribute('controls');
    var bar = document.createElement('div');
    bar.className = 'process-playback';
    var toggle = document.createElement('button');
    toggle.type = 'button';
    bar.appendChild(toggle);
    frame.insertAdjacentElement('afterend', bar);
    function updateButton() {
      toggle.textContent = video.dataset.autoplayBlocked === 'true' ? '▶ 영상 재생하기' : video.paused ? '▶ 재생하기' : 'Ⅱ 멈춰 보기';
      toggle.setAttribute('aria-pressed', String(video.paused));
      toggle.setAttribute('aria-label', video.getAttribute('aria-label') + (video.paused ? ' 재생하기' : ' 멈춰 보기'));
    }
    toggle.addEventListener('click', function () {
      if (video.paused) {
        delete video.dataset.userPaused;
        delete video.dataset.autoplayBlocked;
        video.dataset.motionAllowed = 'true';
        video.muted = true; video.defaultMuted = true; video.playsInline = true;
        video.play().then(updateButton).catch(function (error) {
          if (error && error.name === 'AbortError') return;
          video.dataset.autoplayBlocked = 'true';
          updateButton();
        });
      } else {
        video.dataset.userPaused = 'true';
        video.pause();
      }
    });
    video.addEventListener('play', updateButton);
    video.addEventListener('pause', updateButton);
    video.addEventListener('torso:playbackchange', updateButton);
    updateButton();
  });
})();
