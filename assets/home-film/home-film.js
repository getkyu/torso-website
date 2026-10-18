(function(){
'use strict';
var video=document.getElementById('hero-style-film');if(!video)return;
var button=document.querySelector('.home-film-toggle');
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
var visible=false,manualPause=false,explicit=false,pending=false;
video.controls=false;video.muted=true;video.defaultMuted=true;
function label(){if(!button)return;var playing=!video.paused;button.hidden=false;button.setAttribute('aria-pressed',playing?'false':'true');button.setAttribute('aria-label',playing?'스타일 영상 일시정지':'스타일 영상 재생');button.firstElementChild.textContent=playing?'\u2161':'\u25B6';}
function allowed(){return visible&&!document.hidden&&!manualPause&&(!reduce.matches||explicit);}
function sync(){if(!allowed()){video.pause();label();return;}if(pending)return;pending=true;video.muted=true;Promise.resolve(video.play()).catch(function(){}).finally(function(){pending=false;if(!allowed())video.pause();label();});}
if(button)button.addEventListener('click',function(){if(video.paused){manualPause=false;explicit=true;sync();}else{manualPause=true;video.pause();label();}});
video.addEventListener('play',label);video.addEventListener('pause',label);video.addEventListener('canplay',sync);
document.addEventListener('visibilitychange',sync);
if('IntersectionObserver'in window){new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(video);}else{visible=true;sync();}
function motionChange(){explicit=false;if(reduce.matches)video.pause();sync();}
if(reduce.addEventListener)reduce.addEventListener('change',motionChange);else reduce.addListener(motionChange);
if(reduce.matches)video.pause();
label();
})();
