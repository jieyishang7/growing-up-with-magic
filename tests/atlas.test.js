import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {jaccard,landscape,timePosition} from '../src/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../public/atlas.json',import.meta.url)));
const films=data.films;
test('95 unique films and evidence-backed annotations; unknown stays unknown',()=>{
 assert.equal(films.length,95);assert.equal(new Set(films.map(f=>f.id)).size,95);
 assert.equal(films.filter(f=>f.studio==='Pixar').length,31);
 assert.equal(films.filter(f=>f.themes.length).length,10);
 for(const f of films)for(const a of [...f.themes,...f.life_stages,...f.relationships]){
  for(const k of ['source_url','evidence','evidence_locator','coding_rule','review_status'])assert.ok(a[k]);
 }
 const unknown=films.find(f=>!f.themes.length);assert.equal(jaccard(unknown,unknown),null);
});
test('similarity respects sets and deterministic landscape survives filtering',()=>{
 const coded=films.filter(f=>f.themes.length);assert.equal(jaccard(coded[0],coded[0]),1);
 assert.equal(jaccard(coded[0],coded[1]),jaccard(coded[1],coded[0]));
 assert.deepEqual([...landscape(films)],[...landscape([...films].reverse())]);
});
test('95 identities remain finite through reversible spatial transformations',()=>{
 const p=landscape(films);
 for(let mode=0;mode<=2;mode+=.125)for(const [i,f] of films.entries()){
  const xy=timePosition(f,i,mode,films,p);assert.ok(xy.every(Number.isFinite));
  assert.deepEqual(xy,timePosition(f,i,mode,films,p));
 }
 const f=films.find(f=>f.themes.length);assert.deepEqual(timePosition(f,0,2,films,p),p.get(f.id));
});
test('client data only includes IMDb audience metrics and source dates remain honest',()=>{
 for(const f of films){assert.ok(!('rotten_tomatoes_score' in f));if(f.rating){assert.ok(f.rating.averageRating>=0&&f.rating.averageRating<=10);assert.ok(f.rating.numVotes>=0);assert.equal(f.rating.observed_at,'');}}
});
