import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {riverLayout,galaxyLayout,timeDomain} from '../src/storyLayouts.js';
const films=JSON.parse(fs.readFileSync(new URL('../public/atlas.json',import.meta.url))).films;
test('river retains every coded film once and keeps unknown films out of thematic coordinates',()=>{
 const nodes=riverLayout(films),coded=films.filter(f=>f.themes.length);
 assert.deepEqual(nodes.map(n=>n.film.id),coded.map(f=>f.id));
 assert.equal(new Set(nodes.map(n=>n.film.id)).size,nodes.length);
 for(const n of nodes)assert.ok(Number.isFinite(n.x)&&Number.isFinite(n.y));
 const extent=timeDomain(films);assert.ok(extent[0]<=Math.min(...coded.map(f=>f.year))&&extent[1]>=Math.max(...coded.map(f=>f.year)));
 assert.deepEqual(riverLayout([]),[]);
});
test('galaxy contains only evidenced film-theme edges and reproduces coordinates',()=>{
 const a=galaxyLayout(films),b=galaxyLayout([...films].reverse());
 const recorded=new Set(films.flatMap(f=>f.themes.map(t=>`${f.id}|${t.theme}`)));
 assert.equal(a.links.length,recorded.size);
 for(const l of a.links)assert.ok(recorded.has(`${l.source.id}|${l.target.id}`));
 assert.deepEqual(a.nodes.map(n=>[n.id,n.x,n.y]),b.nodes.map(n=>[n.id,n.x,n.y]));
 assert.ok(a.nodes.every(n=>Number.isFinite(n.x)&&Number.isFinite(n.y)));
 assert.equal(galaxyLayout([]).nodes.length,0);
});

test('landscape unfolds into the river without losing any of the 95 film identities',async()=>{
 const {journeyPosition}=await import('../src/storyLayouts.js');
 const {landscape,timePosition}=await import('../src/model.js');
 const positions=landscape(films),river=new Map(riverLayout(films).map(n=>[n.film.id,[n.x,n.y]]));
 for(const [i,f] of films.entries()){
  const start=journeyPosition(f,i,2,films,positions,river);
  assert.deepEqual(start,timePosition(f,i,2,films,positions));
  const end=journeyPosition(f,i,3,films,positions,river);
  if(river.has(f.id))assert.deepEqual(end,river.get(f.id));
  const mid=journeyPosition(f,i,2.5,films,positions,river);
  assert.ok(mid.every((v,k)=>Math.abs(v-(start[k]+end[k])/2)<1e-9));
  for(const t of [3,2.75,2.5,2.25,2])assert.ok(journeyPosition(f,i,t,films,positions,river).every(Number.isFinite));
 }
});
