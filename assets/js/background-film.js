(function(){
  'use strict';
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobile=window.matchMedia('(max-width:700px)');
  var films=[];
  document.querySelectorAll('[data-bg-film],.banner__video').forEach(function(video){
    var surface=video.closest('.film-surface,.banner--film'); if(!surface)return;
    var item={video:video,surface:surface,visible:false,paused:false,explicit:false,blocked:false};
    films.push(item);
    video.muted=true;video.defaultMuted=true;video.playsInline=true;video.loop=true;
    video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
    var button=document.createElement('button');button.type='button';button.className='film-toggle';surface.appendChild(button);
    function label(){button.textContent=video.paused?'▶ 영상 재생':'Ⅱ 영상 멈추기';button.setAttribute('aria-label',video.paused?'배경 영상 재생':'배경 영상 일시정지');button.setAttribute('aria-pressed',String(!video.paused));}
    function attempt(force){
      if(document.hidden||!item.visible||item.paused||(!force&&reduced.matches&&!item.explicit))return;
      video.muted=true;var playing=video.play();
      if(playing)playing.then(function(){item.blocked=false;label();}).catch(function(){item.blocked=true;label();});
    }
    item.attempt=attempt;
    function source(){
      var src=mobile.matches?video.dataset.mobileSrc:video.dataset.desktopSrc;
      var poster=mobile.matches?video.dataset.mobilePoster:video.dataset.desktopPoster;
      if(poster)video.poster=poster;
      if(src&&video.getAttribute('src')!==src){video.src=src;video.load();attempt(false);}
    }
    video.removeAttribute('autoplay');
    source();
    button.addEventListener('click',function(){
      item.explicit=true;
      if(video.paused){item.paused=false;attempt(true);}else{item.paused=true;video.pause();}
      label();
    });
    video.addEventListener('playing',label);video.addEventListener('pause',label);
    video.addEventListener('loadeddata',function(){attempt(false);});
    video.addEventListener('error',function(){button.textContent='영상 다시 재생';item.blocked=true;});
    if('IntersectionObserver'in window){var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){item.visible=entry.isIntersecting;if(item.visible)attempt(false);else video.pause();});},{threshold:0.05});observer.observe(surface);}else{item.visible=true;attempt(false);}
    if(mobile.addEventListener)mobile.addEventListener('change',source);else mobile.addListener(source);
    label();
  });
  // Retry only policy-blocked films, in the user's tap event, without overriding pauses.
  document.addEventListener('pointerup',function(event){if(event.target.closest('.film-toggle'))return;films.forEach(function(item){if(item.blocked&&!reduced.matches)item.attempt(false);});},{passive:true});
  function resume(){films.forEach(function(item){if(document.hidden)item.video.pause();else item.attempt(false);});}
  document.addEventListener('visibilitychange',resume);window.addEventListener('pageshow',resume);
  function motionChange(){films.forEach(function(item){if(reduced.matches&&!item.explicit)item.video.pause();else item.attempt(false);});}
  if(reduced.addEventListener)reduced.addEventListener('change',motionChange);else reduced.addListener(motionChange);
})();
