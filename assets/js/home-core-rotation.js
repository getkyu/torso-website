/* Each core is one continuous film: 20 frames per style at 24fps (0.833s). */
(function(){
'use strict';
var reduced=matchMedia('(prefers-reduced-motion: reduce)'),paused=false,allowed=false;
var button=document.querySelector('.home-core-toggle');
var cards=Array.from(document.querySelectorAll('[data-home-core]')).map(function(wrap){
 var core=wrap.dataset.homeCore,poster=wrap.querySelector('img');
 poster.src='assets/home-film/core-'+core+'.jpg';poster.classList.remove('is-framed');poster.removeAttribute('style');
 var v=document.createElement('video');v.muted=true;v.defaultMuted=true;v.loop=true;v.playsInline=true;v.preload='none';
 v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('aria-hidden','true');v.poster=poster.src;v.className='home-core-film';
 wrap.appendChild(v);var c={wrap:wrap,video:v,visible:false,started:false,blocked:false};
 v.addEventListener('playing',function(){wrap.classList.add('has-active');c.blocked=false;update();});
 v.addEventListener('error',function(){wrap.classList.remove('has-active');c.blocked=true;update();});return c;
});
function enabled(){return !paused&&(!reduced.matches||allowed);}
function update(){if(!button)return;button.hidden=false;var off=!enabled()||cards.some(function(c){return c.visible&&c.blocked;});button.textContent=off?'스타일 영상 재생':'스타일 영상 일시정지';button.setAttribute('aria-pressed',String(off));button.setAttribute('aria-label',off?'스타일 영상 재생':'스타일 영상 일시정지');}
function sync(c){var v=c.video;if(!c.visible||document.hidden||!enabled()){v.pause();return;}if(!c.started){v.src='assets/home-film/core-'+c.wrap.dataset.homeCore+'.mp4';c.started=true;}if(!v.paused)return;var p=v.play();if(p)p.then(function(){if(!c.visible||document.hidden||!enabled())v.pause();}).catch(function(e){if(e.name!=='AbortError'){c.blocked=true;update();}});}
function all(){cards.forEach(sync);update();}
if(button)button.addEventListener('click',function(){if(!enabled()||cards.some(function(c){return c.visible&&c.blocked;})){paused=false;allowed=true;cards.forEach(function(c){c.blocked=false;});}else paused=true;all();});
if('IntersectionObserver'in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){var c=cards.find(function(c){return c.wrap===e.target;});c.visible=e.isIntersecting&&e.intersectionRatio>=.15;sync(c);});},{threshold:[0,.15]});cards.forEach(function(c){io.observe(c.wrap);});}else cards.forEach(function(c){c.visible=true;});
document.addEventListener('visibilitychange',all);window.addEventListener('pageshow',all);window.addEventListener('pagehide',function(){cards.forEach(function(c){c.video.pause();});});
function change(){allowed=false;all();}if(reduced.addEventListener)reduced.addEventListener('change',change);else reduced.addListener(change);all();
})();
