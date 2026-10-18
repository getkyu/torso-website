(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'), saveData=navigator.connection&&navigator.connection.saveData;
 const players=[...document.querySelectorAll('.pick-film')].map(frame=>{
  const v=frame.querySelector('video'),b=frame.querySelector('button'); const p={v,b,visible:false,manual:false,paused:false};
  v.controls=false;b.hidden=false;
  const update=()=>{b.textContent=v.paused?'▶ 영상 보기':'Ⅱ 멈춰 보기';b.setAttribute('aria-label',v.getAttribute('aria-label')+(v.paused?' 재생':' 일시정지'));b.setAttribute('aria-pressed',String(!v.paused))};
  p.sync=()=>{if(!document.hidden&&p.visible&&!p.paused&&(!(reduced.matches||saveData)||p.manual)){v.muted=true;v.play().catch(update)}else v.pause();update()};
  b.addEventListener('click',()=>{p.manual=true;p.paused=!v.paused;p.sync()});
  v.addEventListener('play',update);v.addEventListener('pause',update);v.addEventListener('error',()=>{b.textContent='영상 재생 불가 · 아래 사용법 보기';b.disabled=true});update();return p;
 });
 const obs=new IntersectionObserver(entries=>entries.forEach(e=>{const p=players.find(p=>p.v===e.target);p.visible=e.isIntersecting&&e.intersectionRatio>=.2;p.sync()}),{threshold:[0,.2,.5]});players.forEach(p=>obs.observe(p.v));
 document.addEventListener('visibilitychange',()=>players.forEach(p=>p.sync()));reduced.addEventListener('change',()=>players.forEach(p=>p.sync()));
})();
