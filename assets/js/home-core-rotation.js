// Existing Torso style clips; positioning measured from their original frames.
(function () {
'use strict';
var section=document.querySelector('#styles');if(!section)return;
var button=section.querySelector('.home-core-toggle');if(!button)return;
var LISTS={"archive":["s1-1_01.mp4","s1-2_01.mp4","s1-3_01.mp4","s1-1_02.mp4","s1-2_02.mp4","s1-3_02.mp4","s1-1_03.mp4","s1-2_03.mp4","s1-3_03.mp4","s1-1_04.mp4","s1-2_04.mp4","s1-2_05.mp4","s1-2_06.mp4","s1-2_07.mp4"],"sharp":["s2-1_01.mp4","s2-2_01.mp4","s2-3_01.mp4","s2-1_02.mp4","s2-2_02.mp4","s2-3_02.mp4","s2-1_03.mp4","s2-2_03.mp4","s2-3_03.mp4","s2-3_04.mp4"],"soft":["s3-1_01.mp4","s3-2_01.mp4","s3-3_01.mp4","s3-1_02.mp4","s3-2_02.mp4","s3-3_02.mp4","s3-1_03.mp4","s3-2_03.mp4","s3-3_03.mp4","s3-1_04.mp4","s3-2_04.mp4"],"classic":["s4-1_01.mp4","s4-2_01.mp4","s4-3_01.mp4","s4-1_02.mp4","s4-3_02.mp4","s4-1_03.mp4","s4-1_04.mp4"]};
var FRAMES={"s1-1_01.mp4":{"duration":19.17,"height":854,"width":480,"head":[0.59,0.49,0.57,0.39],"track":[[0,0.5534,0.4845],[0.25,0.5593,0.4929],[0.5,0.59,0.49],[0.75,0.6594,0.4901],[1,0.66,0.4889]]},"s1-1_02.mp4":{"duration":5.367,"height":854,"width":480,"head":[0.54,0.48,0.8,0.47],"track":[[0,0.54,0.48],[1,0.54,0.48]]},"s1-1_03.mp4":{"duration":3.237,"height":854,"width":480,"head":[0.68,0.53,0.68,0.43],"track":[[0,0.653,0.5634],[0.25,0.6748,0.5477],[0.5,0.68,0.53],[0.75,0.6746,0.5141],[1,0.674,0.5043]]},"s1-1_04.mp4":{"duration":3.634,"height":852,"width":480,"head":[0.48,0.5,0.74,0.4],"track":[[0,0.5071,0.4883],[0.25,0.48,0.5]]},"s1-2_01.mp4":{"duration":6.734,"height":854,"width":480,"head":[0.55,0.47,0.66,0.39],"track":[[0,0.48,0.4806],[0.25,0.48,0.457],[0.5,0.55,0.47],[0.75,0.5624,0.4667],[1,0.5212,0.4693]]},"s1-2_02.mp4":{"duration":8.067,"height":854,"width":480,"head":[0.56,0.47,0.48,0.33],"track":[[0,0.5982,0.4624],[0.25,0.5777,0.462],[0.5,0.56,0.47],[0.75,0.5371,0.4704],[1,0.5193,0.513]]},"s1-2_03.mp4":{"duration":12.1,"height":854,"width":480,"head":[0.56,0.48,0.79,0.48],"track":[[0,0.5246,0.4701],[0.25,0.5571,0.4875],[0.5,0.56,0.48],[0.75,0.574,0.4767],[1,0.5579,0.4697]]},"s1-2_04.mp4":{"duration":9,"height":854,"width":480,"head":[0.54,0.44,0.77,0.43],"track":[[0,0.4907,0.4439],[0.25,0.5116,0.441],[0.5,0.54,0.44],[0.75,0.5189,0.4435],[1,0.47,0.4805]]},"s1-2_05.mp4":{"duration":8.367,"height":852,"width":480,"head":[0.43,0.57,0.76,0.52],"track":[[0,0.4325,0.5817],[0.25,0.4277,0.5828],[0.5,0.43,0.57],[0.75,0.4839,0.561],[1,0.4986,0.5667]]},"s1-2_06.mp4":{"duration":5.3,"height":854,"width":480,"head":[0.42,0.59,0.68,0.43],"track":[[0,0.42,0.59],[1,0.42,0.59]]},"s1-2_07.mp4":{"duration":3.7,"height":854,"width":480,"head":[0.51,0.53,0.67,0.47],"track":[[0,0.491,0.5398],[0.25,0.4922,0.5267],[0.5,0.51,0.53],[1,0.5358,0.5313]]},"s1-3_01.mp4":{"duration":20.8,"height":854,"width":480,"head":[0.5,0.46,0.73,0.48],"track":[[0,0.4518,0.4571],[0.25,0.4772,0.4566],[0.5,0.5,0.46],[0.75,0.4916,0.4612],[1,0.4711,0.4675]]},"s1-3_02.mp4":{"duration":10.534,"height":854,"width":480,"head":[0.57,0.47,0.77,0.54],"track":[[0,0.64,0.4419],[0.25,0.64,0.4457],[0.5,0.57,0.47],[0.75,0.5,0.4864],[1,0.5,0.4655]]},"s1-3_03.mp4":{"duration":5.734,"height":854,"width":480,"head":[0.43,0.45,0.73,0.48],"track":[[0,0.5,0.4522],[0.25,0.4764,0.4468],[0.5,0.43,0.45],[0.75,0.3818,0.4552],[1,0.36,0.4636]]},"s2-1_01.mp4":{"duration":4.709,"height":854,"width":480,"head":[0.59,0.54,0.7,0.53],"track":[[0,0.52,0.518],[0.25,0.5293,0.5171],[0.5,0.59,0.54],[0.75,0.5959,0.538],[1,0.5757,0.5415]]},"s2-1_02.mp4":{"duration":2.97,"height":854,"width":480,"head":[0.52,0.44,0.59,0.46],"track":[[0,0.5163,0.4239],[0.25,0.5281,0.4293],[0.5,0.52,0.44],[0.75,0.5294,0.436],[1,0.5308,0.4336]]},"s2-1_03.mp4":{"duration":2.567,"height":854,"width":480,"head":[0.41,0.47,0.8,0.49],"track":[[0,0.3932,0.4637],[0.25,0.41,0.47],[0.75,0.3967,0.4511],[1,0.4253,0.4594]]},"s2-2_01.mp4":{"duration":6.459,"height":854,"width":480,"head":[0.46,0.34,0.64,0.4],"track":[[0,0.5149,0.3327],[0.25,0.4909,0.3309],[0.5,0.46,0.34],[0.75,0.4344,0.3417],[1,0.4341,0.3454]]},"s2-2_02.mp4":{"duration":4.267,"height":854,"width":480,"head":[0.54,0.52,0.62,0.42],"track":[[0,0.5181,0.5265],[0.25,0.5299,0.5187],[0.5,0.54,0.52],[0.75,0.5418,0.5173],[1,0.5447,0.5088]]},"s2-2_03.mp4":{"duration":28.417,"height":854,"width":480,"head":[0.57,0.44,0.68,0.47],"track":[[0,0.5401,0.4238],[0.25,0.5585,0.4359],[0.5,0.57,0.44],[0.75,0.5885,0.4631],[1,0.6033,0.4867]]},"s2-3_01.mp4":{"duration":3.917,"height":854,"width":480,"head":[0.43,0.55,0.56,0.35],"track":[[0,0.5,0.5575],[0.25,0.4865,0.5513],[0.5,0.43,0.55],[0.75,0.4216,0.5429],[1,0.4363,0.537]]},"s2-3_02.mp4":{"duration":2.597,"height":854,"width":480,"head":[0.41,0.37,0.58,0.44],"track":[[0,0.3639,0.3707],[0.25,0.3923,0.3784],[0.5,0.41,0.37],[0.75,0.4143,0.3546],[1,0.433,0.3579]]},"s2-3_03.mp4":{"duration":5.1,"height":854,"width":480,"head":[0.45,0.41,0.73,0.44],"track":[[0,0.4011,0.4157],[0.25,0.4319,0.4124],[0.5,0.45,0.41],[0.75,0.4745,0.4045],[1,0.509,0.4173]]},"s2-3_04.mp4":{"duration":8,"height":854,"width":480,"head":[0.63,0.52,0.59,0.43],"track":[[0,0.6035,0.5187],[0.25,0.6367,0.5286],[0.5,0.63,0.52],[0.75,0.6273,0.5059]]},"s3-1_01.mp4":{"duration":2.875,"height":854,"width":480,"head":[0.49,0.51,0.9,0.66],"track":[[0,0.4768,0.5043],[0.25,0.4756,0.5069],[0.5,0.49,0.51],[0.75,0.5106,0.5042],[1,0.4961,0.5212]]},"s3-1_02.mp4":{"duration":6.834,"height":854,"width":480,"head":[0.58,0.42,0.64,0.47],"track":[[0,0.51,0.4092],[0.25,0.51,0.4148],[0.5,0.58,0.42],[0.75,0.576,0.4231]]},"s3-1_03.mp4":{"duration":3.6,"height":854,"width":480,"head":[0.45,0.5,0.8,0.54],"track":[[0,0.4455,0.4863],[0.25,0.4581,0.5023],[0.5,0.45,0.5],[0.75,0.456,0.4861],[1,0.4496,0.4879]]},"s3-1_04.mp4":{"duration":2.336,"height":854,"width":480,"head":[0.55,0.53,0.86,0.57],"track":[[0,0.5267,0.5332],[0.25,0.5433,0.5329],[0.5,0.55,0.53],[0.75,0.5528,0.5343],[1,0.5608,0.5353]]},"s3-2_01.mp4":{"duration":6.3,"height":854,"width":480,"head":[0.56,0.4,0.69,0.46],"track":[[0,0.63,0.3866],[0.25,0.63,0.3953],[0.5,0.56,0.4],[0.75,0.5249,0.4],[1,0.5572,0.402]]},"s3-2_02.mp4":{"duration":8.25,"height":854,"width":480,"head":[0.58,0.47,0.79,0.45],"track":[[0,0.5921,0.4694],[0.25,0.5898,0.4731],[0.5,0.58,0.47],[0.75,0.568,0.47],[1,0.5582,0.4721]]},"s3-2_03.mp4":{"duration":9.367,"height":854,"width":480,"head":[0.49,0.44,0.73,0.41],"track":[[0,0.482,0.4467],[0.25,0.4725,0.457],[0.5,0.49,0.44],[0.75,0.4878,0.4536],[1,0.4944,0.4394]]},"s3-2_04.mp4":{"duration":5.5,"height":854,"width":480,"head":[0.46,0.5,0.72,0.52],"track":[[0,0.4578,0.4943],[0.25,0.4526,0.4947],[0.5,0.46,0.5],[0.75,0.4447,0.498],[1,0.4244,0.5052]]},"s3-3_01.mp4":{"duration":4.034,"height":854,"width":480,"head":[0.59,0.5,0.8,0.48],"track":[[0,0.5853,0.5003],[0.25,0.5856,0.5021],[0.5,0.59,0.5],[0.75,0.596,0.5],[1,0.6019,0.5002]]},"s3-3_02.mp4":{"duration":5.467,"height":854,"width":480,"head":[0.45,0.48,0.64,0.47],"track":[[0,0.474,0.4712],[0.25,0.4597,0.4728],[0.5,0.45,0.48],[0.75,0.5046,0.4822],[1,0.49,0.4778]]},"s3-3_03.mp4":{"duration":6.674,"height":854,"width":480,"head":[0.56,0.49,0.88,0.65],"track":[[0,0.5729,0.5014],[0.25,0.5654,0.4967],[0.5,0.56,0.49],[0.75,0.5519,0.4756],[1,0.5484,0.4809]]},"s4-1_01.mp4":{"duration":6.4,"height":854,"width":480,"head":[0.59,0.47,0.9,0.58],"track":[[0,0.52,0.4619],[0.25,0.5631,0.4575],[0.5,0.59,0.47],[1,0.66,0.54]]},"s4-1_02.mp4":{"duration":16.334,"height":854,"width":480,"head":[0.53,0.63,0.51,0.45],"track":[[0,0.46,0.615],[0.25,0.46,0.6213],[0.5,0.53,0.63],[0.75,0.5737,0.633],[1,0.5343,0.6349]]},"s4-1_03.mp4":{"duration":17.601,"height":854,"width":480,"head":[0.51,0.48,0.41,0.3],"track":[[0,0.4899,0.4691],[0.25,0.4883,0.4723],[0.5,0.51,0.48],[0.75,0.5115,0.485],[1,0.5122,0.487]]},"s4-1_04.mp4":{"duration":2.934,"height":854,"width":480,"head":[0.4,0.5,0.78,0.47],"track":[[0,0.4,0.5],[1,0.4,0.5]]},"s4-2_01.mp4":{"duration":3.838,"height":852,"width":480,"head":[0.52,0.46,0.76,0.54],"track":[[0,0.533,0.4732],[0.25,0.5262,0.4835],[0.5,0.52,0.46],[0.75,0.5211,0.4696],[1,0.5124,0.4646]]},"s4-3_01.mp4":{"duration":6.073,"height":852,"width":480,"head":[0.59,0.48,0.73,0.47],"track":[[0,0.5752,0.4973],[0.25,0.5828,0.4858],[0.5,0.59,0.48],[0.75,0.5756,0.4808],[1,0.582,0.4792]]},"s4-3_02.mp4":{"duration":6.567,"height":854,"width":480,"head":[0.43,0.56,0.56,0.43],"track":[[0,0.5,0.5246],[0.25,0.4609,0.5302],[0.5,0.43,0.56],[0.75,0.36,0.5715],[1,0.36,0.5535]]}};
var INTERVAL=5500,BASE='assets/video/styles/';
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),mobile=window.matchMedia('(max-width:700px)'),userPaused=false,motionAllowed=false;
function motionEnabled(){return mobile.matches||!reduced.matches||motionAllowed;}
function configurePlayback(v){v.muted=true;v.defaultMuted=true;v.autoplay=true;v.playsInline=true;v.setAttribute('muted','');v.setAttribute('autoplay','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');}
var cards=Array.from(section.querySelectorAll('[data-home-core]')).map(function(wrap){
 var clips=LISTS[wrap.dataset.homeCore];if(!clips)return null;
 // Reuse one media element: Safari grants user-initiated playback per element.
 var hold=document.createElement('canvas');hold.className='rotation-hold';hold.setAttribute('aria-hidden','true');wrap.appendChild(hold);
 var v=document.createElement('video');configurePlayback(v);v.loop=true;v.preload='none';v.setAttribute('aria-hidden','true');v.setAttribute('tabindex','-1');wrap.appendChild(v);
 var label=document.createElement('span');label.className='core-stage-label';label.hidden=true;wrap.appendChild(label);
 return {wrap:wrap,clips:clips,video:v,hold:hold,label:label,index:0,inView:false,running:false,blocked:false,token:0,timer:null,fadeTimer:null,loadTimer:null,raf:null,failures:0,abortRetries:0,gestureRetried:false,blockedReason:null};
}).filter(Boolean);
function canRun(c){return c.inView&&!document.hidden&&(mobile.matches||!userPaused)&&!c.blocked&&motionEnabled();}
function resetRecovery(c){c.blocked=false;c.blockedReason=null;c.failures=0;c.abortRetries=0;c.gestureRetried=false;}
function frameVideo(v,key){
 var f=FRAMES[key];if(!f)return;
 var h=f.head,track=f.track,t=v.currentTime,x=h[0],y=h[1];
 if(track.length){var a=track[0],b=track[track.length-1];for(var i=1;i<track.length;i++){if(track[i][0]>=t){a=track[i-1];b=track[i];break;}}
  var p=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0]||1)));x=a[1]+(b[1]-a[1])*p;y=a[2]+(b[2]-a[2])*p;}
 var width=Math.min(.62*(f.width/f.height)/(.8*h[3]),.80/h[2]);
 v.style.width=(width*100)+'%';v.style.aspectRatio=f.width+'/'+f.height;
 v.style.transform='translate('+(-x*100)+'%,'+(-y*100)+'%)';
}
// Keep the exact outgoing frame visible while the same video loads its next source.
function holdFrame(c){
 var v=c.video;
 try{
  if(v.readyState<2||!v.videoWidth)throw new Error('Frame not ready');
  c.hold.width=v.videoWidth;c.hold.height=v.videoHeight;
  c.hold.getContext('2d').drawImage(v,0,0);
  c.hold.style.cssText=v.style.cssText;c.hasHeldFrame=true;
 }catch(e){/* Keep an earlier frame or the original poster when no frame is available. */}
 if(c.hasHeldFrame)c.hold.classList.add('is-visible');
 else c.wrap.classList.remove('has-active');
}
function prepare(c,key){
 var v=c.video;if(v.dataset.clip===key)return;
 holdFrame(c);clearTimeout(c.fadeTimer);v.classList.add('is-loading');v.classList.remove('is-visible');
 v.dataset.clip=key;v.preload='auto';v.src=BASE+key;v.load();frameVideo(v,key);
}
function stop(c){c.running=false;c.token++;clearTimeout(c.timer);clearTimeout(c.fadeTimer);clearTimeout(c.loadTimer);cancelAnimationFrame(c.raf);c.video.pause();}
function animate(c){cancelAnimationFrame(c.raf);function draw(){if(!c.running||!canRun(c))return;frameVideo(c.video,c.clips[c.index]);c.raf=requestAnimationFrame(draw);}draw();}
function needsPlay(){return (!mobile.matches&&userPaused)||!motionEnabled()||cards.some(function(c){return c.blocked;});}
function updateButton(){
 var paused=needsPlay();button.hidden=mobile.matches;button.textContent=paused?'전체 영상 재생하기':'전체 영상 멈추기';button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'스타일 영상 재생하기':'스타일 영상 일시정지');
 cards.forEach(function(c){c.wrap.classList.toggle('motion-enabled',motionEnabled());});
}
function block(c,reason){stop(c);c.blocked=true;c.blockedReason=reason||'load';updateButton();}
function show(c,index){
 if(!canRun(c))return;clearTimeout(c.timer);clearTimeout(c.loadTimer);
 var token=++c.token,v=c.video,key=c.clips[index];c.index=index;configurePlayback(v);prepare(c,key);
 // Keep the current frame while loading; recover only on bounded retries or a new visit.
 c.loadTimer=setTimeout(function(){if(token===c.token)block(c);},8000);
 var playing;try{playing=v.play();}catch(err){failed(err);return;}
 Promise.resolve(playing).then(function(){
  if(token!==c.token)return;
  if(!canRun(c)){stop(c);return;}
  clearTimeout(c.loadTimer);c.failures=0;c.abortRetries=0;c.gestureRetried=false;c.wrap.classList.add('has-active');
  c.wrap.style.setProperty('--core-background','url("assets/img/core-previews/'+key.replace('.mp4','.jpg')+'")');
  frameVideo(v,key);v.classList.remove('is-loading');v.classList.add('is-visible');
  c.fadeTimer=setTimeout(function(){if(token===c.token)c.hold.classList.remove('is-visible');},360);
  c.label.hidden=key!=='s1-2_02.mp4';c.label.textContent=c.label.hidden?'':'시술 전';
  c.wrap.dispatchEvent(new CustomEvent('torso:clipchange',{bubbles:true,detail:{key:key}}));
  animate(c);updateButton();
  c.timer=setTimeout(function(){show(c,(index+1)%c.clips.length);},INTERVAL);
 }).catch(failed);
 function failed(err){
  if(token!==c.token)return;clearTimeout(c.loadTimer);
  if(err&&err.name==='NotAllowedError'){block(c,'policy');return;}
  // load()/pause() can cancel play during a source or visibility change.
  if(err&&err.name==='AbortError'){
   c.abortRetries++;
   if(c.abortRetries<=1){c.timer=setTimeout(function(){show(c,index);},100);return;}
   block(c,'interrupted');return;
  }
  c.failures++;if(c.failures>=c.clips.length){block(c);return;}
  c.timer=setTimeout(function(){show(c,(index+1)%c.clips.length);},INTERVAL);
 }
}
function syncCard(c){if(!canRun(c)){if(c.running)stop(c);return;}if(c.running)return;c.running=true;show(c,c.index);}
function syncAll(){updateButton();cards.forEach(syncCard);}
button.addEventListener('click',function(){
 if(needsPlay()){userPaused=false;motionAllowed=true;cards.forEach(resetRecovery);}
 else userPaused=true;
 // Call play synchronously from the tap, preserving the browser's user gesture.
 syncAll();
});
function recoverVisible(){
 if(!document.hidden)cards.forEach(function(c){if(c.inView){stop(c);resetRecovery(c);}});
 syncAll();
}
document.addEventListener('visibilitychange',recoverVisible);
window.addEventListener('pageshow',function(){cards.forEach(function(c){stop(c);resetRecovery(c);});syncAll();});
function recoverFromGesture(){
 if(!mobile.matches||document.hidden)return;
 cards.forEach(function(c){
  if(!c.inView||!c.blocked||c.blockedReason!=='policy'||c.gestureRetried)return;
  c.blocked=false;c.blockedReason=null;c.failures=0;c.abortRetries=0;c.gestureRetried=true;
  // play() stays inside the original touch/pointer event, with no timer or await.
  syncCard(c);
 });
 updateButton();
}
document.addEventListener('touchend',recoverFromGesture,{passive:true});
document.addEventListener('pointerup',recoverFromGesture,{passive:true});
function viewportChanged(){
 if(mobile.matches)userPaused=false;
 cards.forEach(function(c){stop(c);resetRecovery(c);});syncAll();
}
if(mobile.addEventListener)mobile.addEventListener('change',viewportChanged);else mobile.addListener(viewportChanged);
function motionChanged(){motionAllowed=false;syncAll();}
if(reduced.addEventListener)reduced.addEventListener('change',motionChanged);else reduced.addListener(motionChanged);
if('IntersectionObserver' in window){
 var observer=new IntersectionObserver(function(entries){entries.forEach(function(e){var c=cards.find(function(x){return x.wrap===e.target;});if(c){var wasInView=c.inView;c.inView=e.isIntersecting&&e.intersectionRatio>=.15;if(c.inView&&!wasInView)resetRecovery(c);syncCard(c);}});},{threshold:[0,.15]});cards.forEach(function(c){observer.observe(c.wrap);});
}else cards.forEach(function(c){c.inView=true;});
syncAll();
})();
