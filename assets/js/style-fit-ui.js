// Tie editorial selection cues to the video that has actually started playing.
(function(){
'use strict';
var map=window.TORSO_STYLE_FIT||{};
var questions={
 '가볍고 부드럽게':'가볍고 부드러운 분위기를 원한다면?',
 '부드럽고 입체적으로':'부드럽고 입체적인 분위기를 원한다면?',
 '개성 있게, 자유롭게':'개성 있고 자유로운 분위기를 원한다면?',
 '빈티지하고 감각적으로':'빈티지하고 감각적인 분위기를 원한다면?',
 '자유롭고 편안하게':'자유롭고 편안한 분위기를 원한다면?',
 '단정하고 또렷하게':'단정하고 또렷한 인상을 원한다면?',
 '간결하고 선명하게':'간결하고 선명한 인상을 원한다면?',
 '짧고 깔끔하게':'짧고 깔끔한 스타일을 원한다면?',
 '자연스럽고 여유롭게':'자연스럽고 여유로운 분위기를 원한다면?',
 '균형 있고 차분하게':'균형 있고 차분한 인상을 원한다면?',
 '단정한 남성미':'단정한 남성미를 원한다면?',
 '클래식하고 무게감 있게':'클래식하고 무게감 있는 분위기를 원한다면?'
};
function render(wrap,key){
 var fit=map[key];if(!fit)return;
 var card=wrap.closest('a'),isCore=wrap.hasAttribute('data-home-core');if(!card)return;
 card.dataset.fitClip=key;
 var stage=key==='s1-1_01.mp4'?'과정 살펴보기':key==='s1-2_02.mp4'?'변화 비교하기':'';
 if(isCore){
  card.classList.add('has-style-fit');
  var heading=card.querySelector('h3');
  heading.replaceChildren();
  var prompt=document.createElement('small');prompt.textContent=stage;prompt.hidden=!stage;
  var mood=document.createElement('strong');mood.textContent=questions[fit.mood]||fit.mood;
  heading.append(prompt,mood);
  card.querySelector('.j-core-mood').textContent=fit.style;
  card.querySelector('.j-core-note').textContent=fit.reason;
 }else{
  var caption=card.querySelector('.style-fit-caption');
  if(!caption){caption=document.createElement('div');caption.className='style-fit-caption';caption.innerHTML='<small></small><strong></strong><p></p>';card.appendChild(caption);}
  card.classList.add('has-style-fit');
  caption.querySelector('small').textContent=stage;caption.querySelector('small').hidden=!stage;
  caption.querySelector('strong').textContent=questions[fit.mood]||fit.mood;
  caption.querySelector('p').textContent=fit.style+' · '+fit.reason;
 }
}
document.addEventListener('torso:clipchange',function(e){render(e.target,e.detail.key);});
// The designer fallback posters are exact frames of these first clips.
var first={jinsung:'s1-1_02.mp4',jinhoon:'s1-2_03.mp4',junyoung:'s1-2_01.mp4'};
document.querySelectorAll('[data-designer-work]').forEach(function(card){render(card.querySelector('.designer-work-media'),first[card.dataset.designerWork]);});
})();
