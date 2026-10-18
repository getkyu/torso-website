(function(){
'use strict';
var video=document.getElementById('hero-style-film');if(!video)return;
var button=document.querySelector('.home-film-toggle');
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
var visible=false,manualPause=false,explicit=false,pending=false;
video.controls=false;button.hidden=false;
function label(){button.textContent=video.paused?'▶ 영상 재생':'Ⅱ 멈춰 보기';button.setAttribute('aria-label',video.paused?'헤어스타일 모음 영상 재생':'헤어스타일 모음 영상 일시정지');}
function allowed(){return visible&&!document.hidden&&!manualPause&&(!reduce.matches||explicit);}
function sync(){if(!allowed()){video.pause();label();return;}if(pending)return;pending=true;video.muted=true;Promise.resolve(video.play()).catch(function(){}).finally(function(){pending=false;if(!allowed())video.pause();label();});}
button.addEventListener('click',function(){if(video.paused){manualPause=false;explicit=true;sync();}else{manualPause=true;video.pause();label();}});
video.addEventListener('play',label);video.addEventListener('pause',label);video.addEventListener('canplay',sync);
document.addEventListener('visibilitychange',sync);
if('IntersectionObserver'in window){new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(video);}else{visible=true;sync();}
function motionChange(){explicit=false;sync();}if(reduce.addEventListener)reduce.addEventListener('change',motionChange);else reduce.addListener(motionChange);
label();
})();
