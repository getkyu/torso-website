const $=id=>document.getElementById(id);
const content={
 soft:{silhouette:'가볍게 흐르는 앞머리와 부드러운 옆선',texture:'자연스러운 결 · 은은한 볼륨',care:'앞머리의 뿌리 방향을 먼저 말리고 가볍게 마무리',check:'앞머리가 갈라지는 위치와 뜨는 옆머리, 필요한 길이'},
 sharp:{silhouette:'이마의 노출과 정돈된 옆선으로 또렷한 인상',texture:'선이 보이는 정돈감 · 짧은 질감',care:'앞머리를 세우거나 내릴 방향부터 잡아 마무리',check:'헤어라인·모류에 따른 이마 노출 범위와 정리 주기'},
 classic:{silhouette:'한쪽으로 이어지는 흐름과 단정한 실루엣',texture:'차분한 결 · 넘기는 볼륨',care:'가르마와 넘기는 방향을 드라이한 뒤 제품으로 고정',check:'넘길 수 있는 길이와 뿌리 방향, 제품 사용 선호'},
 archive:{silhouette:'컬과 층의 움직임을 살린 입체적인 형태',texture:'분명한 질감 · 자유로운 움직임',care:'컬을 뭉치거나 풀어내는 방식에 맞춰 건조·제품 선택',check:'모질·손상도·현재 길이와 펌 이력, 평소 손질 부담'}
};
let active=null,saving=false,generation=0;
function el(tag,text,cls){const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;}
export function showFeatures(o){
 const area=$('feature-summary');area.replaceChildren();
 const intro=el('div');intro.append(el('span','수치를 상담의 언어로','eyebrow'),el('h3','내 얼굴에서 비교해 볼 두 가지'));
 const a=el('article'),b=el('article');
 a.append(el('span','01 · 이마와 앞머리'),el('h4','얼마나 드러낼 때 마음에 드나요?'),el('p',`이 사진에서 세로는 가로의 약 ${o.heightRatio.toFixed(2)}배로 관찰됩니다. 앞머리를 내리거나 열었을 때의 인상을 실제 상담에서 비교해 보세요.`));
 b.append(el('span','02 · 옆선과 볼륨'),el('h4','어디에 볼륨을 두고 싶나요?'),el('p',`턱선의 기준점 사이 폭은 광대 근처 폭의 약 ${Math.round(o.jawRatio*100)}%입니다. 옆머리를 붙일지, 자연스럽게 남길지 실제 두상·모류와 함께 살펴봅니다.`));
 area.append(intro,a,b,el('p','사진 속 비율은 참고점입니다. 얼굴형의 정답이나 외모 점수를 매기지 않으며, 아래 스타일은 직접 고른 취향에 따라 제안합니다.','small'));
}
export function clearUpgrade(){generation++;active=null;$('feature-summary')?.replaceChildren();$('style-comparison')?.replaceChildren();if($('picked-style'))$('picked-style').textContent='두 방향을 비교한 뒤 하나를 고르거나, 둘 다 상담에서 비교해도 괜찮아요.';for(const id of ['save-status','copy-status'])if($(id))$(id).textContent='';}
export function upgradeComparison(data){
 generation++;active={...data,picked:null};$('save-status').textContent='';$('copy-status').textContent='';
 const cards=$('style-cards').querySelectorAll('.style-card');
 cards.forEach((card,i)=>{const id=data.ids[i],wrap=el('article','','selectable-style');card.replaceWith(wrap);card.querySelector('small').textContent='토르소 실제 시술 · 내 사진 합성 아님';card.querySelector('span').textContent='이 방향의 실제 사례 보기 ↗';wrap.append(card);const btn=el('button','이 방향이 더 마음에 들어요','pick-button');btn.type='button';btn.setAttribute('aria-pressed','false');btn.dataset.style=id;btn.addEventListener('click',()=>choose(id));wrap.append(btn);});
 const box=$('style-comparison');box.replaceChildren();box.append(el('p','COMPARE THE DETAILS','eyebrow'),el('h3','어떻게 다르게 느껴질까요?'));
 const table=el('table'),caption=el('caption','직접 고른 취향에 따른 두 방향의 차이');table.append(caption);
 const head=el('thead'),hr=el('tr');hr.append(el('th','비교할 부분'));data.ids.forEach(id=>hr.append(el('th',data.styles[id][0])));head.append(hr);table.append(head);
 const body=el('tbody');[['silhouette','형태와 인상'],['texture','결과 질감'],['care','집에서 손질'],['check','현장에서 확인']].forEach(([key,label])=>{const row=el('tr');const th=el('th',label);th.scope='row';row.append(th);data.ids.forEach(id=>row.append(el('td',content[id][key])));body.append(row);});table.append(body);box.append(table);
 const unsure=el('button','둘 다 상담에서 비교할게요','text-button');unsure.type='button';unsure.addEventListener('click',()=>choose(null));box.append(unsure);
 choose(null);
}
function choose(id){if(!active)return;active.picked=id;document.querySelectorAll('.pick-button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.style===id)));const text=id?`내가 고른 방향: ${active.styles[id][0]} · ${active.styles[id][1]}`:'두 방향 모두 상담에서 비교하고 싶어요.';$('picked-style').textContent=text;active.onNote(active.baseNote+'\n선호: '+text);$('copy-status').textContent='';}
function wrap(ctx,text,x,y,maxWidth,line=32){let row='',yy=y;for(const char of text){if(char==='\n'){ctx.fillText(row,x,yy);row='';yy+=line;continue;}if(ctx.measureText(row+char).width>maxWidth){ctx.fillText(row,x,yy);row=char;yy+=line;}else row+=char;}if(row)ctx.fillText(row,x,yy);return yy+line;}
function fit(ctx,img,x,y,w,h){const scale=Math.min(w/img.width,h/img.height);const iw=img.width*scale,ih=img.height*scale;ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);}
$('save-card').addEventListener('click',async()=>{
 if(!active||saving)return;saving=true;const token=generation,a=active;$('save-card').disabled=true;$('save-status').textContent='상담 카드를 만드는 중이에요.';
 try{await document.fonts.ready;const c=document.createElement('canvas');c.width=1080;c.height=1590;const ctx=c.getContext('2d');ctx.fillStyle='#f5f3ed';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#24473e';ctx.font='700 23px Pretendard';ctx.fillText('TORSO / MY STYLE NOTE',60,75);ctx.font='700 50px Pretendard';ctx.fillText('디자이너와 함께 고를 나의 스타일',60,151);ctx.font='24px Pretendard';ctx.fillStyle='#52605b';ctx.fillText('사진 속 특징 + 내가 고른 취향 · 상담 참고용',60,204);
 ctx.fillStyle='#e9e8e2';ctx.fillRect(60,246,310,375);fit(ctx,a.source,60,246,310,375);
 ctx.font='700 25px Pretendard';ctx.fillStyle='#24473e';ctx.fillText('내가 고른 취향',418,289);ctx.font='27px Pretendard';let y=343;for(const t of [a.mood,a.fringe,a.routine])y=wrap(ctx,t,418,y,600,40)+12;
 ctx.font='23px Pretendard';ctx.fillStyle='#58615d';wrap(ctx,`사진 속 세로/가로 약 ${a.observation.heightRatio.toFixed(2)}배\n턱선/광대 근처 폭 약 ${Math.round(a.observation.jawRatio*100)}%`,418,514,600,36);
 const imgs=await Promise.all(a.ids.map(id=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src='assets/img/'+a.styles[id][2];})));
 if(token!==generation)return;
 for(let i=0;i<2;i++){const x=60+i*495;ctx.fillStyle='#e9e8e2';ctx.fillRect(x,680,465,405);fit(ctx,imgs[i],x,680,465,405);ctx.fillStyle='#24473e';ctx.font='700 31px Pretendard';ctx.fillText(a.styles[a.ids[i]][0]+(a.picked===a.ids[i]?'  ✓':''),x,1134);ctx.font='23px Pretendard';wrap(ctx,a.styles[a.ids[i]][1],x,1174,460,32);}
 ctx.fillStyle='#52605b';ctx.font='22px Pretendard';wrap(ctx,'위 작품은 토르소의 실제 시술 사례입니다. 고객 사진에 합성한 결과가 아닙니다.\n사진 속 비율은 실제 길이·얼굴형 판정이 아니며, 시술 가능 범위와 손질은 상담에서 확인합니다.',60,1274,955,34);ctx.fillStyle='#24473e';ctx.font='700 25px Pretendard';wrap(ctx,a.picked?'선호 방향: '+a.styles[a.picked][0]:'두 방향 모두 상담에서 비교하고 싶어요.',60,1405,950,34);ctx.font='24px Pretendard';ctx.fillText('torsofor.men · 토르소 맨즈헤어 홍대상수역점',60,1520);
 const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(token!==generation)return;if(!blob)throw new Error('image');const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='토르소_나의_상담카드.png';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);$('save-status').textContent='이미지 저장을 요청했어요. 브라우저의 다운로드를 확인해 주세요. 사진은 이 카드에 포함됩니다.';
 }catch{if(token===generation)$('save-status').textContent='이미지를 저장하지 못했어요. 상담 메모를 복사하거나 화면을 캡처해 주세요.';}finally{saving=false;$('save-card').disabled=false;}
});
