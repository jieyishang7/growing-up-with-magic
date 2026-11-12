export function gallerySelection(films,{expanded=false,studio='All studios',decade='All decades'}={}){
 const chronological=[...films].sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));
 const items=expanded?chronological.filter(f=>(studio==='All studios'||f.studio===studio)&&(decade==='All decades'||Math.floor(f.year/10)*10===Number(decade))):chronological.filter(f=>f.themes.length).slice(0,10);
 return {items,total:items.length};
}
