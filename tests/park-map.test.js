import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {polygonContains} from 'd3';
import {islandLayout,documentedConnection} from '../src/parkMapModel.js';
const films=JSON.parse(fs.readFileSync(new URL('../public/atlas.json',import.meta.url))).films;
test('park neighbourhoods retain all 95 film identities in the correct release decades',()=>{
 const layout=islandLayout(films),nodes=layout.flatMap(d=>d.films);
 assert.equal(layout.length,10);assert.equal(nodes.length,95);assert.equal(new Set(nodes.map(n=>n.film.id)).size,95);
 assert.deepEqual(islandLayout([...films].reverse()),layout);
 for(const island of layout){const occupied=new Set();for(const n of island.films){
  assert.equal(Math.floor(n.film.year/10)*10,island.decade);
  assert.ok(Number.isFinite(n.x)&&Number.isFinite(n.y));assert.ok(polygonContains(island.outline,[n.x,n.y]));
  const key=`${n.x},${n.y}`;assert.ok(!occupied.has(key));occupied.add(key);
 }}
});
test('cross-park routes require positive shared theme evidence; missing coding stays unknown',()=>{
 const nemo=films.find(f=>f.id==='pixar-finding-nemo'),red=films.find(f=>f.id==='pixar-turning-red'),unknown=films.find(f=>!f.themes.length);
 const result=documentedConnection(nemo,red);assert.equal(result.status,'shared_documented_themes');assert.ok(result.shared.includes('Family'));
 for(const theme of result.shared){assert.ok(nemo.themes.some(t=>t.theme===theme));assert.ok(red.themes.some(t=>t.theme===theme));}
 assert.deepEqual(documentedConnection(unknown,red),{status:'needs_coding',shared:[]});
 assert.equal(documentedConnection(null,red).status,'needs_coding');
 assert.deepEqual(documentedConnection({themes:[{theme:'Family'}]},{themes:[{theme:'Memory'}]}),{status:'no_shared_recorded_themes',shared:[]});
});
