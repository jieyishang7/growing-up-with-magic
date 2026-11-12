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
