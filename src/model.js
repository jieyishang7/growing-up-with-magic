import * as d3 from 'd3';
export const colors=['#c0a3ff','#e06ba8','#f0b96b','#9a83f3','#77a4ef','#bdb9f7','#e789c5','#db597f','#baa0d7','#8cb8bc'];
export const themeNames=['Friendship','Family','Love','Identity','Belonging','Independence','Fear','Loss','Purpose','Memory'];
export const themeColor=t=>colors[themeNames.indexOf(t)];
export const memberships=f=>new Set(f.themes.map(t=>t.theme));
export function jaccard(a,b){const aa=memberships(a),bb=memberships(b);if(!aa.size||!bb.size)return null;return [...aa].filter(t=>bb.has(t)).length/new Set([...aa,...bb]).size;}
// Deterministic metric stress layout: Jaccard distance, all pair constraints, fixed initial circle.
// Only positive annotations participate. Missing labels are unknown, not negative evidence.
export function landscape(films){
 const coded=films.filter(f=>f.themes.length).sort((a,b)=>a.id.localeCompare(b.id));
 const p=coded.map((f,i)=>({id:f.id,x:Math.cos(i/coded.length*Math.PI*2)*180,y:Math.sin(i/coded.length*Math.PI*2)*180}));
 for(let n=0;n<420;n++){let deltas=p.map(()=>({x:0,y:0}));for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){
 const dx=p[j].x-p[i].x,dy=p[j].y-p[i].y,dist=Math.hypot(dx,dy)||.001,target=40+(1-jaccard(coded[i],coded[j]))*300,k=(dist-target)/dist*.025;
 deltas[i].x+=dx*k;deltas[i].y+=dy*k;deltas[j].x-=dx*k;deltas[j].y-=dy*k;}
 p.forEach((a,i)=>{a.x+=deltas[i].x;a.y+=deltas[i].y;});}
 const extX=d3.extent(p,d=>d.x),extY=d3.extent(p,d=>d.y),scale=Math.max(extX[1]-extX[0],extY[1]-extY[0],1);
 return new Map(p.map(a=>[a.id,[500+(a.x-(extX[0]+extX[1])/2)/scale*550,310+(a.y-(extY[0]+extY[1])/2)/scale*340]]));
}
export function timePosition(f,index,mode,all,positions){
 const t=(f.year-1937)/89;const same=all.filter(a=>a.year===f.year),lane=same.findIndex(a=>a.id===f.id);const angle=-Math.PI/2+t*Math.PI*2+(lane-(same.length-1)/2)*.035;
 const r=80+t*205;const disc=[500+Math.cos(angle)*r,330+Math.sin(angle)*r];
 const tunnelR=34+Math.pow(t,1.8)*300;const tunnel=[500+Math.cos(angle)*tunnelR,255+t*100+Math.sin(angle)*tunnelR*.74];
 const unknown=all.filter(a=>!a.themes.length);const ui=unknown.findIndex(a=>a.id===f.id);
 const land=positions.get(f.id)||[80+(ui%40)*21.5,567+Math.floor(ui/40)*12];
 return mode<=1?d3.interpolate(tunnel,disc)(mode):d3.interpolate(disc,land)(mode-1);
}
