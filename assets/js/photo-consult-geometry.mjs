// Photo-space measurements only. These thresholds reject unsuitable inputs;
// they are not aesthetic criteria or validated face-shape classifications.
export const OVAL = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
export const MEASURE_POINTS = [10,152,234,454,172,397];
export function inspectFaces(faces, width, height) {
  if (!Array.isArray(faces) || !faces.length) return {ok:false,code:'no-face'};
  if (faces.length !== 1) return {ok:false,code:'multiple'};
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return {ok:false,code:'invalid'};
  const points = faces[0];
  const ids = [...new Set([...OVAL,...MEASURE_POINTS,1,33,263])];
  if (!Array.isArray(points) || ids.some(i=>!points[i] || !Number.isFinite(points[i].x) || !Number.isFinite(points[i].y))) return {ok:false,code:'invalid'};
  const p = i=>({x:points[i].x*width,y:points[i].y*height});
  const distance = (a,b)=>Math.hypot(p(a).x-p(b).x,p(a).y-p(b).y);
  const faceWidth=distance(234,454), faceHeight=distance(10,152), jawWidth=distance(172,397);
  if (faceWidth<130 || faceHeight<170 || faceWidth/width<.16) return {ok:false,code:'small'};
  if (OVAL.some(i=>points[i].x<.01 || points[i].x>.99 || points[i].y<.01 || points[i].y>.99)) return {ok:false,code:'cropped'};
  const left=p(33), right=p(263), nose=p(1), cheekLeft=p(234),cheekRight=p(454);
  const roll=Math.abs(Math.atan2(right.y-left.y,right.x-left.x)*180/Math.PI);
  const tilt=Math.min(roll,Math.abs(180-roll));
  const sideA=Math.abs(nose.x-cheekLeft.x),sideB=Math.abs(cheekRight.x-nose.x);
  if (tilt>12 || Math.min(sideA,sideB)<1 || Math.max(sideA,sideB)/Math.min(sideA,sideB)>2.2) return {ok:false,code:'angle'};
  const eyeY=(left.y+right.y)/2,chinY=p(152).y;
  const nosePosition=(nose.y-eyeY)/(chinY-eyeY);
  if (!Number.isFinite(nosePosition)||nosePosition<.18||nosePosition>.72) return {ok:false,code:'angle'};
  const heightRatio=faceHeight/faceWidth,jawRatio=jawWidth/faceWidth;
  if (!Number.isFinite(heightRatio)||!Number.isFinite(jawRatio)||heightRatio<=0||jawRatio<=0) return {ok:false,code:'invalid'};
  const box={x:Math.min(...OVAL.map(i=>p(i).x)),y:Math.min(...OVAL.map(i=>p(i).y)),width:Math.max(...OVAL.map(i=>p(i).x))-Math.min(...OVAL.map(i=>p(i).x)),height:Math.max(...OVAL.map(i=>p(i).y))-Math.min(...OVAL.map(i=>p(i).y))};
  return {ok:true,heightRatio,jawRatio,box};
}
export function pixelQuality(imageData) {
  const {data,width,height}=imageData;
  if (!data || width<3 || height<3 || data.length!==width*height*4) return {ok:false,code:'invalid'};
  const gray=new Float64Array(width*height);let luminance=0;
  for(let i=0;i<gray.length;i++){gray[i]=data[i*4]*.299+data[i*4+1]*.587+data[i*4+2]*.114;luminance+=gray[i];}
  luminance/=gray.length;
  if(luminance<23||luminance>240) return {ok:false,code:'light'};
  let sum=0,sumSq=0,count=0;
  for(let y=1;y<height-1;y++) for(let x=1;x<width-1;x++){const i=y*width+x;const v=gray[i-1]+gray[i+1]+gray[i-width]+gray[i+width]-4*gray[i];sum+=v;sumSq+=v*v;count++;}
  const variance=sumSq/count-(sum/count)**2;
  return variance<12?{ok:false,code:'blur'}:{ok:true};
}
