import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gallerySelection} from '../src/galleryModel.js';
const films=JSON.parse(fs.readFileSync(new URL('../public/atlas.json',import.meta.url))).films;
test('featured mode shows only ten evidenced flowers without changing film records',()=>{
 const result=gallerySelection(films);assert.equal(result.items.length,10);assert.ok(result.items.every(f=>f.themes.length>0));assert.equal(films.length,95);
});
test('expanded archive shows all 95 films at once without paging or duplicates',()=>{
 const result=gallerySelection(films,{expanded:true});assert.equal(result.total,95);assert.equal(result.items.length,95);assert.equal(new Set(result.items.map(f=>f.id)).size,95);assert.ok(!('page' in result));
});
test('archive filters preserve complete matching sets and handle empty results',()=>{
 const pixar=gallerySelection(films,{expanded:true,studio:'Pixar'});assert.equal(pixar.total,31);assert.equal(pixar.items.length,31);
 const decade=gallerySelection(films,{expanded:true,decade:'2010'});assert.ok(decade.items.every(f=>f.year>=2010&&f.year<2020));
 const empty=gallerySelection(films,{expanded:true,studio:'Pixar',decade:'1930'});assert.equal(empty.total,0);assert.equal(empty.items.length,0);
});
