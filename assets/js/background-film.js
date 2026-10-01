(function(){
  'use strict';
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobile=window.matchMedia('(max-width:700px)');
  var films=[];
  document.querySelectorAll('[data-bg-film],.banner__video').forEach(function(video){
    var surface=video.closest('.film-surface,.banner--film');if(!surface)return;
    var item={video:video,surface:surface,visible:false,paused:false,explicit:false,blocked:false,pending:false,gestureRetried:false};
    films.push(item);
    video.muted=true;video.defaultMuted=true;video.playsInline=true;video.loop=true;video.controls=false;
    video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
    var button=document.createElement('button');button.type='button';button.className='film-toggle';surface.appendChild(button);
    function allowed(){return !document.hidden&&item.visible&&(mobile.matches||!item.paused)&&(mobile.matches||!reduced.matches||item.explicit||video.hasAttribute('data-continuous'));}
    function label(){button.hidden=mobile.matches||video.hasAttribute('data-no-controls');button.textContent=video.paused?'▶ 영상 재생':'Ⅱ 영상 멈추기';button.setAttribute('aria-label',video.paused?'배경 영상 재생':'배경 영상 일시정지');button.setAttribute('aria-pressed',String(!video.paused));}
    function syncAutoplay(){video.autoplay=allowed();if(video.autoplay)video.setAttribute('autoplay','');else video.removeAttribute('autoplay');}
    function failure(error){
      item.pending=false;
      item.blocked=!!(error&&error.name==='NotAllowedError'&&allowed());
      label();
    }
    function attempt(){
      syncAutoplay();label();
      if(!allowed()){video.pause();return;}
      if(item.pending)return;
      video.muted=true;video.defaultMuted=true;item.pending=true;
      var playing;try{playing=video.play();}catch(error){failure(error);return;}
      Promise.resolve(playing).then(function(){
        item.pending=false;item.blocked=false;item.gestureRetried=false;
        if(!allowed())video.pause();
        label();
      }).catch(failure);
    }
    item.attempt=attempt;
    function source(){
      syncAutoplay();
      var src=mobile.matches?video.dataset.mobileSrc:video.dataset.desktopSrc;
      var poster=mobile.matches?video.dataset.mobilePoster:video.dataset.desktopPoster;
      if(poster)video.poster=poster;
      if(src&&video.getAttribute('src')!==src){video.src=src;video.load();}
      attempt();
    }
    video.removeAttribute('autoplay');source();
    button.addEventListener('click',function(){
      item.explicit=true;
      if(video.paused){item.paused=false;attempt();}else{item.paused=true;syncAutoplay();video.pause();}
      label();
    });
    video.addEventListener('playing',function(){if(!allowed())video.pause();label();});
    video.addEventListener('pause',label);
    video.addEventListener('loadeddata',attempt);video.addEventListener('canplay',attempt);
    video.addEventListener('error',function(){item.pending=false;item.blocked=false;label();});
    if('IntersectionObserver' in window){
      var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){item.visible=entry.isIntersecting&&entry.intersectionRatio>=.05;attempt();});},{threshold:[0,.05]});observer.observe(surface);
    }else{item.visible=true;attempt();}
    if(mobile.addEventListener)mobile.addEventListener('change',source);else mobile.addListener(source);
    label();
  });
  // A real user interaction may authorize playback; retry each blocked episode once.
  function gesture(event){
    if(event.target&&event.target.closest&&event.target.closest('.film-toggle'))return;
    films.forEach(function(item){if(item.blocked&&!item.gestureRetried&&!item.pending){item.gestureRetried=true;item.attempt();}});
  }
  document.addEventListener('touchend',gesture,{passive:true});document.addEventListener('pointerup',gesture,{passive:true});document.addEventListener('keydown',gesture);
  function sync(){films.forEach(function(item){item.attempt();});}
  document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',sync);
  if(reduced.addEventListener)reduced.addEventListener('change',sync);else reduced.addListener(sync);
})();
