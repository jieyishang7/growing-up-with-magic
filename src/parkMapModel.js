import {polygonContains} from 'd3';

// Imagined geography is navigation, not a measured area or an emotional score.
export const islandDefinitions=[
 {decade:1930,cx:205,cy:155,rx:94,ry:76,color:'#e0d4aa',name:'Once upon a time'},
 {decade:1940,cx:446,cy:218,rx:143,ry:121,color:'#d6d5ad',name:'The early adventures'},
 {decade:1950,cx:754,cy:163,rx:141,ry:102,color:'#e2cfa7',name:'A little enchantment'},
 {decade:1960,cx:1067,cy:174,rx:105,ry:97,color:'#c7d1ad',name:'Into the wild'},
 {decade:1970,cx:204,cy:422,rx:125,ry:111,color:'#c9cca4',name:'Unexpected companions'},
 {decade:1980,cx:510,cy:451,rx:147,ry:103,color:'#e0c9a6',name:'New horizons'},
 {decade:1990,cx:895,cy:412,rx:191,ry:139,color:'#d8c39d',name:'A world of possibilities'},
 {decade:2000,cx:323,cy:762,rx:224,ry:157,color:'#c7d1ad',name:'Finding our way'},
 {decade:2010,cx:769,cy:741,rx:205,ry:166,color:'#e2cba8',name:'Finding ourselves'},
 {decade:2020,cx:1180,cy:714,rx:153,ry:200,color:'#c9d2b4',name:'Stories still unfolding'},
];
export function islandOutline(island,index){
 return Array.from({length:22},(_,i)=>{const a=i/22*Math.PI*2;const coast=1+.07*Math.sin(a*5+index*1.7)+.05*Math.cos(a*3-index);return [island.cx+Math.cos(a)*island.rx*coast,island.cy+Math.sin(a)*island.ry*coast];});
}
export function islandLayout(films){
 return islandDefinitions.map((island,index)=>{
  const outline=islandOutline(island,index);
  const members=films.filter(f=>Math.floor(f.year/10)*10===island.decade).sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));
  let candidates=[];
  // Stable row-major slots, inset from the coast and below the decade label.
  for(let y=island.cy-island.ry+68;y<island.cy+island.ry-23;y+=46){
   const row=[];
   for(let x=island.cx-island.rx+30;x<island.cx+island.rx-20;x+=43){
    if(polygonContains(outline,[x-18,y-24])&&polygonContains(outline,[x+18,y+20]))row.push([x,y]);
   }
   if(candidates.length%2)row.reverse();
   candidates.push(...row);
  }
  if(candidates.length<members.length)throw new Error(`Island ${island.decade} needs more film slots (${candidates.length}/${members.length})`);
  // Distribute sparse decades around the centre rather than the edge.
  if(members.length<5)candidates=candidates.sort((a,b)=>Math.hypot(a[0]-island.cx,a[1]-island.cy)-Math.hypot(b[0]-island.cx,b[1]-island.cy));
  return {...island,outline,films:members.map((film,i)=>({film,x:candidates[i][0],y:candidates[i][1]}))};
 });
}
export function documentedConnection(a,b){
 if(!a?.themes.length||!b?.themes.length)return {status:'needs_coding',shared:[]};
 const shared=a.themes.map(t=>t.theme).filter(t=>b.themes.some(s=>s.theme===t));
 return {status:shared.length?'shared_documented_themes':'no_shared_recorded_themes',shared};
}
