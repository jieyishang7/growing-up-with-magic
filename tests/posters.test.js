import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const posters=JSON.parse(fs.readFileSync(new URL('../src/posters-data.json',import.meta.url)));
const films=JSON.parse(fs.readFileSync(new URL('../public/atlas.json',import.meta.url))).films;
test('every film has a year-matched sourced poster; version evidence remains explicit',()=>{
 assert.equal(Object.keys(posters).length,95);
 for(const f of films){const p=posters[f.id];assert.ok(p,f.id);assert.equal(p.year,f.year);assert.equal(p.title,f.title);assert.ok(p.release_evidence.includes(String(f.year)));assert.ok(p.source.startsWith('https://en.wikipedia.org/wiki/'));assert.ok(p.file_source.includes('/wiki/File:'));assert.ok(p.src.startsWith('https://upload.wikimedia.org/')||p.src.startsWith('https://thumb.wikimedia.org/'));assert.ok(p.caption);assert.ok(p.review_status.includes('not_independently_reviewed'));}
 assert.ok(posters['pixar-inside-out'].src.includes('2015_film'));
 assert.equal(posters['pixar-inside-out'].caption,'Theatrical release poster');
 assert.equal(Object.values(posters).filter(p=>p.version==='poster_version_pending_review').length,4);
});
