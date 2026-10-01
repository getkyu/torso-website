// Tie editorial selection cues to the video that has actually started playing.
(function(){
'use strict';
var map=window.TORSO_STYLE_FIT||{};
// Use only catalog names; a generic suffix does not infer a cut/perm subtype.
function styleName(name){return /컷|펌|스타일|시술 전|시술 과정/.test(name)?name:name+' 스타일';}
function fileName(src){return (src||'').split(/[?#]/)[0].split('/').pop();}
function imageLabel(wrap,key,isPoster){
 var fit=map[key];if(!fit)return;
 var kind=isPoster?'poster':'active';
 var label=wrap.querySelector('.style-name-label--'+kind);
 if(!label){
  label=document.createElement('span');label.className='style-name-label style-name-label--'+kind;
  // The existing captions below the artwork provide the same accessible text.
  label.setAttribute('aria-hidden','true');wrap.appendChild(label);
 }
 label.textContent=styleName(fit.style);
 label.dataset.stage=key==='s1-2_02.mp4'?'before':key==='s1-1_01.mp4'?'process':'finished';
 label.dataset.styleClip=key;
}
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
function render(wrap,key,isPoster){
 var fit=map[key];if(!fit||!wrap||!wrap.matches('.home-core-media,.designer-work-media'))return;
 var card=wrap.closest('a'),isCore=wrap.hasAttribute('data-home-core');if(!card)return;
 imageLabel(wrap,key,isPoster);
 card.dataset.fitClip=key;
 var stage=key==='s1-1_01.mp4'?'과정 살펴보기':key==='s1-2_02.mp4'?'변화 비교하기':'';
 if(isCore){
  card.classList.add('has-style-fit');
  var heading=card.querySelector('h3');
  if(!heading)return;heading.replaceChildren();
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
document.addEventListener('torso:clipchange',function(e){if(e.detail)render(e.target,e.detail.key,false);});
// These category posters were checked against frames of the named source clips.
// Keep their labels separate so reduced-motion fallback cannot show a later clip's name.
var posters={
 'core_soft_poster.jpg':'s3-2_02.mp4','core_sharp_poster.jpg':'s2-1_01.mp4',
 'core_archive_poster.jpg':'s1-2_05.mp4','core_classic_poster.jpg':'s4-1_02.mp4'
};
document.querySelectorAll('.home-core-media').forEach(function(wrap){
 var poster=wrap.querySelector('img');if(poster)imageLabel(wrap,posters[fileName(poster.getAttribute('src'))],true);
});
// The designer fallback posters are exact frames of these first clips.
var first={jinsung:'s1-1_02.mp4',jinhoon:'s1-2_03.mp4',junyoung:'s1-2_01.mp4'};
document.querySelectorAll('[data-designer-work]').forEach(function(card){render(card.querySelector('.designer-work-media'),first[card.dataset.designerWork],true);});
// The styles page already has one tag inside each image. Reuse it, including
// the catalog name for grouped photos, without adding labels to consultation media.
var catalog={},cores=(window.TORSO_MEDIA||{}).CORES||{};
Object.keys(cores).forEach(function(core){cores[core].styles.forEach(function(style){catalog[style.code]=style;});});
document.querySelectorAll('.smedia[data-style]').forEach(function(grid){
 var style=catalog[grid.dataset.style];if(!style)return;
 grid.querySelectorAll('.vitem').forEach(function(tile){
  var tag=tile.querySelector('.vitem__tag'),video=tile.querySelector('video');if(!tag)return;
  var fit=video?map[fileName(video.getAttribute('src'))]:null;
  if(video&&!fit)return;
  tag.textContent=styleName(fit?fit.style:style.name);
  tag.classList.add('style-name-label');
 });
});
})();
