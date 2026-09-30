// Tie editorial selection cues to the video that has actually started playing.
(function(){
'use strict';
var map=window.TORSO_STYLE_FIT||{};
function render(wrap,key){
 var fit=map[key];if(!fit)return;
 var card=wrap.closest('a'),isCore=wrap.hasAttribute('data-home-core');if(!card)return;
 card.dataset.fitClip=key;
 var stage=key==='s1-1_01.mp4'?'과정 살펴보기':key==='s1-2_02.mp4'?'변화 비교하기':'이런 분위기를 원한다면';
 if(isCore){
  card.classList.add('has-style-fit');
  var heading=card.querySelector('h3');
  heading.replaceChildren();
  var prompt=document.createElement('small');prompt.textContent=stage;
  var mood=document.createElement('strong');mood.textContent=fit.mood;
  heading.append(prompt,mood);
  card.querySelector('.j-core-mood').textContent=fit.style;
  card.querySelector('.j-core-note').textContent=fit.reason;
 }else{
  var caption=card.querySelector('.style-fit-caption');
  if(!caption){caption=document.createElement('div');caption.className='style-fit-caption';caption.innerHTML='<small></small><strong></strong><p></p>';card.appendChild(caption);}
  card.classList.add('has-style-fit');
  caption.querySelector('small').textContent=stage;
  caption.querySelector('strong').textContent=fit.mood;
  caption.querySelector('p').textContent=fit.style+' · '+fit.reason;
 }
}
document.addEventListener('torso:clipchange',function(e){render(e.target,e.detail.key);});
// The designer fallback posters are exact frames of these first clips.
var first={jinsung:'s1-1_02.mp4',jinhoon:'s1-2_03.mp4',junyoung:'s1-2_01.mp4'};
document.querySelectorAll('[data-designer-work]').forEach(function(card){render(card.querySelector('.designer-work-media'),first[card.dataset.designerWork]);});
})();
