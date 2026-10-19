(function(){
'use strict';
// 2026-10-20 원장님 요청 '재생 버튼을 누르지 않아도 바로 자동 재생' — 동작 줄이기 설정과 관계없이 소리 없이 자동 재생.
// 저전력 모드 등으로 자동 재생이 막히면 화면을 처음 터치하는 순간 다시 재생한다.
var video=document.getElementById('hero-style-film');if(!video)return;
var button=document.querySelector('.home-film-toggle');
var visible=false,manualPause=false,pending=false;
video.controls=false;video.muted=true;video.defaultMuted=true;video.setAttribute('muted','');video.setAttribute('autoplay','');video.setAttribute('playsinline','');
function label(){if(!button)return;var playing=!video.paused;button.hidden=false;button.setAttribute('aria-pressed',playing?'false':'true');button.setAttribute('aria-label',playing?'스타일 영상 일시정지':'스타일 영상 재생');button.firstElementChild.textContent=playing?'Ⅱ':'▶';}
function allowed(){return visible&&!document.hidden&&!manualPause;}
function sync(){if(!allowed()){video.pause();label();return;}if(pending)return;pending=true;video.muted=true;Promise.resolve(video.play()).catch(function(){}).finally(function(){pending=false;if(!allowed())video.pause();label();});}
if(button)button.addEventListener('click',function(){if(video.paused){manualPause=false;sync();}else{manualPause=true;video.pause();label();}});
video.addEventListener('play',label);video.addEventListener('pause',label);video.addEventListener('canplay',sync);video.addEventListener('loadeddata',sync);
document.addEventListener('visibilitychange',sync);
function kick(){if(video.paused&&!manualPause)sync();}
['touchstart','pointerdown','scroll','keydown'].forEach(function(t){window.addEventListener(t,kick,{passive:true});});
if('IntersectionObserver'in window){new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(video);}else{visible=true;sync();}
label();
})();
