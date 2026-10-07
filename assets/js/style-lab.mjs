const $=id=>document.getElementById(id);
const content={
 soft:{silhouette:'가볍게 흐르는 앞머리와 부드러운 옆선',texture:'자연스러운 결 · 은은한 볼륨',care:'앞머리의 뿌리 방향을 먼저 말리고 가볍게 마무리',check:'앞머리가 갈라지는 위치와 뜨는 옆머리, 필요한 길이'},
 sharp:{silhouette:'이마의 노출과 정돈된 옆선으로 또렷한 인상',texture:'선이 보이는 정돈감 · 짧은 질감',care:'앞머리를 세우거나 내릴 방향부터 잡아 마무리',check:'헤어라인·모류에 따른 이마 노출 범위와 정리 주기'},
 classic:{silhouette:'한쪽으로 이어지는 흐름과 단정한 실루엣',texture:'차분한 결 · 넘기는 볼륨',care:'가르마와 넘기는 방향을 드라이한 뒤 제품으로 고정',check:'넘길 수 있는 길이와 뿌리 방향, 제품 사용 선호'},
 archive:{silhouette:'컬과 층의 움직임을 살린 입체적인 형태',texture:'분명한 질감 · 자유로운 움직임',care:'컬을 뭉치거나 풀어내는 방식에 맞춰 건조·제품 선택',check:'모질·손상도·현재 길이와 펌 이력, 평소 손질 부담'}
};
let active=null,generation=0,cardFile=null,cardURL=null,sharing=false;
function el(tag,text,cls){const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;}
function pair(parent,rows){const group=el('div','','measure-pair');const max=Math.max(...rows.map(r=>r[1]));for(const [label,value] of rows){const row=el('div'),meter=el('meter');meter.min=0;meter.max=max;meter.value=value;meter.setAttribute('aria-label',label+' '+value);row.append(el('span',label),meter,el('b',String(value)));group.append(row);}parent.append(group);}
export function showFeatures(o){
 const area=$('feature-summary');area.replaceChildren();
 const intro=el('div');intro.append(el('span','내 사진 안에서 비교해요','eyebrow'),el('h3','이 숫자는 어떤 뜻일까요?'));
 const a=el('article'),b=el('article'),h=Math.round(o.heightRatio*100),j=Math.round(o.jawRatio*100);
 a.append(el('span','01 · 표시한 가로와 세로'),el('h4',`가로 100에, 세로 약 ${h}`));pair(a,[['광대 근처 폭',100],['이마 기준점~턱끝',h]]);
 a.append(el('p',`표시한 가로를 100으로 놓았을 때의 세로 길이예요. ${h>=100?`가로보다 약 ${h-100}% 길게`:`가로보다 약 ${100-h}% 짧게`} 관찰된다는 뜻이며, 평균보다 얼굴이 길다는 판정은 아닙니다.`),el('p','상담에서는 앞머리를 내리거나 열 때 보이는 세로선과, 윗머리·옆머리 볼륨을 함께 비교해요.','style-meaning'),el('small','세로의 시작점은 헤어라인이 아니에요. 전체 얼굴 길이나 이마 길이와는 다릅니다.'));
 b.append(el('span','02 · 광대 근처 폭과 턱선 폭'),el('h4',`광대 근처 100에, 턱선 약 ${j}`));pair(b,[['광대 근처 폭',100],['턱선 기준점 폭',j]]);
 b.append(el('p',`이 사진의 턱선 기준점 사이 폭이 광대 근처 폭보다 약 ${Math.abs(100-j)}% ${j<=100?'좁게':'넓게'} 관찰돼요. 다른 사람보다 턱이 좁거나 넓다는 뜻은 아니에요.`),el('p','상담에서는 옆머리와 귀 주변을 얼마나 남길 때 원하는 인상이 되는지 비교해요. 이 숫자만으로 다운펌 여부를 정하지 않습니다.','style-meaning'));
 area.append(intro,a,b);
 if(o.segmentRatio){const u=Math.round(o.segmentRatio.upperPercent),l=100-u,c=el('article');c.append(el('span','03 · 미간부터 턱끝까지의 두 구간'),el('h4',`위쪽 약 ${u} : 아래쪽 약 ${l}`));pair(c,[['미간 위~코 아래',u],['코 아래~턱끝',l]]);c.append(el('p',`두 구간의 합을 100으로 놓은 비중이에요. ${u===l?'사진에서는 두 구간이 비슷하게':u>l?'미간 위~코 아래 구간이 더 길게':'코 아래~턱끝 구간이 더 길게'} 관찰됩니다. 50 : 50이 더 좋은 비율이라는 뜻은 아닙니다.`),el('p','앞머리의 길이·두께와 이마를 드러내는 범위를 함께 바꿔 보며, 원하는 인상에 가까운 쪽을 찾아요.','style-meaning'),el('small','분홍색 미간 위·코 아래 추정점과 턱끝을 사용해요. 해부학적 얼굴 삼등분 검사와는 다릅니다.'));area.append(c);}
 else area.append(el('p','미간부터 턱끝까지의 두 구간은 이번 사진에서 안정적으로 비교하지 못했어요. 다른 정면 사진으로 확인할 수 있습니다.','small'));
 area.append(el('p','비교 기준은 ‘내 사진의 다른 길이’입니다. 연령·집단별 평균이나 미적 이상 비율은 이 기능에 적용하지 않았어요. 각도·표정·렌즈에 따라 달라지므로 헤어라인·두상·모질과 함께 상담에서 확인합니다. 아래 스타일은 직접 고른 취향에 따라 제안합니다.','small'));
}
function clearCard(){cardFile=null;if(cardURL)URL.revokeObjectURL(cardURL);cardURL=null;$('card-preview').removeAttribute('src');$('download-card').removeAttribute('href');$('card-preview-panel').hidden=true;$('save-card').disabled=true;$('save-card').textContent='상담 카드 준비 중';}
export function clearUpgrade(){generation++;active=null;clearCard();$('feature-summary')?.replaceChildren();$('style-comparison')?.replaceChildren();if($('picked-style'))$('picked-style').textContent='두 방향을 비교한 뒤 하나를 고르거나, 둘 다 상담에서 비교해도 괜찮아요.';for(const id of ['save-status','copy-status'])if($(id))$(id).textContent='';}
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
function choose(id){if(!active)return;active.picked=id;document.querySelectorAll('.pick-button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.style===id)));const text=id?`내가 고른 방향: ${active.styles[id][0]} · ${active.styles[id][1]}`:'두 방향 모두 상담에서 비교하고 싶어요.';$('picked-style').textContent=text;active.onNote(active.baseNote+'\n선호: '+text);$('copy-status').textContent='';$('booking-next').hidden=true;$('booking-open').textContent='네이버에서 상담 예약 ↗';prepareCard();}
function wrap(ctx,text,x,y,maxWidth,line=32){let row='',yy=y;for(const char of text){if(char==='\n'){ctx.fillText(row,x,yy);row='';yy+=line;continue;}if(ctx.measureText(row+char).width>maxWidth){ctx.fillText(row,x,yy);row=char;yy+=line;}else row+=char;}if(row)ctx.fillText(row,x,yy);return yy+line;}
function fit(ctx,img,x,y,w,h){const scale=Math.min(w/img.width,h/img.height);const iw=img.width*scale,ih=img.height*scale;ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);}
async function prepareCard(){
 if(!active)return;const token=++generation,a={...active};clearCard();$('save-status').textContent='선택한 내용으로 상담 카드를 준비하고 있어요.';
 try{await document.fonts.ready;if(token!==generation)return;const c=document.createElement('canvas');c.width=1080;c.height=1590;const ctx=c.getContext('2d');ctx.fillStyle='#f5f3ed';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#24473e';ctx.font='700 23px Pretendard';ctx.fillText('TORSO / MY STYLE NOTE',60,75);ctx.font='700 50px Pretendard';ctx.fillText('디자이너와 함께 고를 나의 스타일',60,151);ctx.font='24px Pretendard';ctx.fillStyle='#52605b';ctx.fillText('사진 속 특징 + 내가 고른 취향 · 상담 참고용',60,204);
 ctx.fillStyle='#e9e8e2';ctx.fillRect(60,246,310,375);fit(ctx,a.source,60,246,310,375);
 ctx.font='700 25px Pretendard';ctx.fillStyle='#24473e';ctx.fillText('내가 고른 취향',418,289);ctx.font='27px Pretendard';let y=343;for(const t of [a.mood,a.fringe,a.routine])y=wrap(ctx,t,418,y,600,40)+12;
 ctx.font='23px Pretendard';ctx.fillStyle='#58615d';wrap(ctx,`사진 속 가로 100 : 세로 ${Math.round(a.observation.heightRatio*100)}\n광대 근처 100 : 턱선 ${Math.round(a.observation.jawRatio*100)}${a.observation.segmentRatio?'\n미간 위~코 아래 / 코 아래~턱끝 '+Math.round(a.observation.segmentRatio.upperPercent)+' : '+(100-Math.round(a.observation.segmentRatio.upperPercent)):''}`,418,514,600,36);
 const imgs=await Promise.all(a.ids.map(id=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src='assets/img/'+a.styles[id][2];})));
 if(token!==generation)return;
 for(let i=0;i<2;i++){const x=60+i*495;ctx.fillStyle='#e9e8e2';ctx.fillRect(x,680,465,405);fit(ctx,imgs[i],x,680,465,405);ctx.fillStyle='#24473e';ctx.font='700 31px Pretendard';ctx.fillText(a.styles[a.ids[i]][0]+(a.picked===a.ids[i]?'  ✓':''),x,1134);ctx.font='23px Pretendard';wrap(ctx,a.styles[a.ids[i]][1],x,1174,460,32);}
 ctx.fillStyle='#52605b';ctx.font='22px Pretendard';wrap(ctx,'위 작품은 토르소의 실제 시술 사례입니다. 고객 사진에 합성한 결과가 아닙니다.\n세로: 이마 추정점~턱끝 · 헤어라인 제외. 미적 이상 비율과 비교하지 않습니다.\n사진 속 비율은 실제 길이·얼굴형 판정이 아닙니다. 시술과 손질은 상담에서 확인합니다.',60,1274,955,34);ctx.fillStyle='#24473e';ctx.font='700 25px Pretendard';wrap(ctx,a.picked?'선호 방향: '+a.styles[a.picked][0]:'두 방향 모두 상담에서 비교하고 싶어요.',60,1405,950,34);ctx.font='24px Pretendard';ctx.fillText('torsofor.men · 토르소 맨즈헤어 홍대상수역점',60,1520);
 const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(token!==generation)return;if(!blob)throw new Error('image');cardFile=new File([blob],'토르소_나의_상담카드.png',{type:'image/png'});cardURL=URL.createObjectURL(blob);$('card-preview').src=cardURL;$('download-card').href=cardURL;$('save-card').disabled=sharing;$('save-card').textContent='사진첩에 저장하기';$('save-status').textContent='상담 카드가 준비됐어요. 버튼을 눌러 사진에 저장해 주세요.';
 }catch{if(token===generation){$('save-status').textContent='카드를 준비하지 못했어요. 다시 시도하거나 상담 메모를 복사해 주세요.';$('save-card').textContent='상담 카드 다시 준비';$('save-card').disabled=false;}}
}
function previewCard(){if(!cardFile)return;$('card-preview-panel').hidden=false;}
$('save-card').addEventListener('click',async()=>{
 if(sharing)return;if(!cardFile){prepareCard();return;}previewCard();
 let canShare=false;try{canShare=!!navigator.share&&!!navigator.canShare?.({files:[cardFile]});}catch{}
 if(!canShare){$('save-status').textContent='아래 이미지를 길게 눌러 사진에 저장해 보세요. 사진 저장 메뉴가 없다면 화면 캡처나 파일 저장을 이용할 수 있어요.';$('card-preview-title').focus({preventScroll:true});$('card-preview-panel').scrollIntoView({block:'start',behavior:'smooth'});return;}
 const token=generation;sharing=true;$('save-card').disabled=true;
 try{await navigator.share({files:[cardFile]});if(token===generation)$('save-status').textContent='사진 앱에서 저장된 카드를 확인해 주세요. 아직 없다면 아래 이미지를 길게 눌러 저장할 수 있어요.';}
 catch(error){if(token===generation){$('save-status').textContent=error.name==='AbortError'?'공유 창을 닫았어요. 다시 저장하거나 아래 이미지를 길게 눌러주세요.':'공유 창을 열지 못했어요. 아래 이미지를 길게 눌러 사진에 저장해 보세요.';}}
 finally{sharing=false;if(active&&cardFile)$('save-card').disabled=false;}
});
