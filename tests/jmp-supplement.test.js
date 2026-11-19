import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const atlas=JSON.parse(fs.readFileSync(new URL('../public/atlas.json',import.meta.url)));
test('worksheet candidates cover matched films without silently expanding primary rating coverage',()=>{
 const candidates=atlas.films.filter(f=>f.supplementary_rating);
 assert.equal(candidates.length,93);
 assert.equal(candidates.filter(f=>f.studio==='Disney Animation').length,64);
 assert.equal(candidates.filter(f=>f.studio==='Pixar').length,29);
 assert.equal(atlas.films.filter(f=>f.rating).length,31);
 assert.equal(atlas.coverage.verified_supplementary_rating_films,0);
 for(const f of candidates){const r=f.supplementary_rating;
  assert.equal(r.film_id,f.id);assert.equal(r.review_status,'user_supplied_unverified');
  assert.equal(r.averageRating,null);assert.equal(r.numVotes,null);assert.equal(r.observed_at,null);assert.equal(r.source_scale,null);assert.equal(r.imdb_id,null);
  assert.equal(r.candidate_averageRating,r.imdb_raw/10);
  assert.match(r.source_sha256,/^[a-f0-9]{64}$/);assert.equal(r.snapshot_acquired,'2026-11-19');
 }
 assert.equal(atlas.films.find(f=>f.id==='disney-frozen-2').supplementary_rating.identity_match,'explicit_title_alias_year_studio');
 assert.equal(atlas.films.find(f=>f.id==='pixar-hoppers').supplementary_rating,null);
 const publicText=JSON.stringify(atlas);
 for(const name of ['Tomatometer','Popcornmeter','Metacritic','Worldwide Box Office Revenue','Profit Ratio','Acdemy Award'])assert.ok(!publicText.includes(name));
});
test('movie matching requires year and studio as well as title and rejects ambiguous identities',async()=>{
 const {execFileSync}=await import('node:child_process');
 const script=`import sys;sys.path.insert(0,'analysis')\nfrom import_jmp_supplement import match_film\nf=[dict(id='frozen',title='Frozen 2',year=2019,studio='Disney Animation')]\nassert match_film('Frozen II',2019,'Disney',f)[0]['id']=='frozen'\nfor title,year,studio in [('Frozen II',2020,'Disney'),('Frozen II',2019,'Pixar')]:\n try:match_film(title,year,studio,f)\n except ValueError:pass\n else:raise AssertionError('Incorrect identity accepted')\ntry:match_film('Frozen II',2019,'Disney',f+f)\nexcept ValueError:pass\nelse:raise AssertionError('Ambiguous identity accepted')`;
 execFileSync('python3',['-c',script],{cwd:new URL('..',import.meta.url)});
});
