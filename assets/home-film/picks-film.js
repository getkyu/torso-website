(() => {
 // 2026-10-19: 원장님 요청 '영상 보기를 누르지 않아도 재생' — 동작 줄이기·데이터 절약 설정과 관계없이 소리 없이 자동 재생.
 // 저전력 모드 등으로 자동 재생이 막히면 화면을 처음 터치하는 순간 보이는 영상을 다시 재생한다.
 const players=[...document.querySelectorAll('.pick-film')].filter(f=>f.querySelector('video')).map(frame=>{
  const v=frame.querySelector('video'),b=frame.querySelector('button'); const p={v,b,visible:false,paused:false};
  v.controls=false;v.muted=true;v.setAttribute('muted','');v.setAttribute('autoplay','');v.preload='auto';if(b)b.hidden=false;
  const update=()=>{if(!b)return;b.textContent=v.paused?'▶ 영상 보기':'Ⅱ 멈춰 보기';b.setAttribute('aria-label',v.getAttribute('aria-label')+(v.paused?' 재생':' 일시정지'));b.setAttribute('aria-pressed',String(!v.paused))};
  p.sync=()=>{if(!document.hidden&&p.visible&&!p.paused){v.muted=true;v.play().catch(update)}else v.pause();update()};
  if(b)b.addEventListener('click',()=>{p.paused=!v.paused;p.sync()});
  v.addEventListener('play',update);v.addEventListener('pause',update);v.addEventListener('error',()=>{if(b){b.textContent='영상 재생 불가 · 아래 사용법 보기';b.disabled=true}});update();return p;
 });
 if(!players.length)return;
 const obs=new IntersectionObserver(entries=>entries.forEach(e=>{const p=players.find(p=>p.v===e.target);p.visible=e.isIntersecting&&e.intersectionRatio>=.2;p.sync()}),{threshold:[0,.2,.5]});players.forEach(p=>obs.observe(p.v));
 document.addEventListener('visibilitychange',()=>players.forEach(p=>p.sync()));
 const kick=()=>players.forEach(p=>{if(p.visible&&!p.paused&&p.v.paused)p.sync()});
 ['touchstart','pointerdown','scroll'].forEach(t=>addEventListener(t,kick,{passive:true}));
})();
