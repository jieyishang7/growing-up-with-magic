import React,{useEffect,useMemo,useRef,useState} from 'react';
import * as d3 from 'd3';
import {Poster,posters} from './Posters.jsx';
import {themeNames,themeColor} from './model.js';
import {islandLayout,documentedConnection} from './parkMapModel.js';
import './storyPark.css';

const studioInk=f=>f.studio==='Pixar'?'#466eaf':'#aa4b70';
const attractionNames=['Time Tunnel','Radial Time Disc','Emotional Landscape','Emotion River','Emotional Garden'];

function MovieResident({node,selected,highlighted,comparison,onPick,onHover}){
 const {film,x,y}=node;
 const [failed,setFailed]=useState(false);
 const poster=posters[film.id];
 return <g className={`island-film ${selected?'selected':''} ${comparison?'comparison':''} ${highlighted?'':'muted'}`} transform={`translate(${x},${y})`} role="button" tabIndex="0" aria-label={`${film.title}, ${film.year}, ${film.studio}${selected?', selected':''}`} aria-pressed={selected} onClick={e=>{e.stopPropagation();onPick(film.id);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onPick(film.id);}}} onMouseEnter={()=>onHover(film.id)} onMouseLeave={()=>onHover(null)} onFocus={()=>onHover(film.id)} onBlur={()=>onHover(null)}>
  <title>{film.title} · {film.year}</title>
  <ellipse cy="17" rx="18" ry="6" fill="#3b4731" opacity=".12"/>
  <circle r="24" cy="-6" className="resident-halo" fill="none"/>
  <path d="M-8 6v10M8 6v10" stroke="#695641" strokeWidth="2"/>
  <rect x="-14" y="-27" width="28" height="36" rx="3" fill="#eee4cc" stroke="#514536" strokeWidth="1.2"/>
  <path d="M-17-27L0-35 17-27Z" fill={studioInk(film)} stroke="#514536" strokeWidth="1"/>
  <text y="-7" textAnchor="middle" className="resident-initial">{film.title.replace(/^The /,'').slice(0,1)}</text>
  {poster&&!failed&&<image href={poster.src} x="-11" y="-24" width="22" height="30" preserveAspectRatio="xMidYMid slice" onError={()=>setFailed(true)}/>}
  {film.studio==='Pixar'?<path d="M0 10l4 4-4 4-4-4Z" fill={studioInk(film)}/>:<circle cy="14" r="3.5" fill={studioInk(film)}/>}
 </g>;
}

function ParkLandmarks({onEnter}){
 const ride=(id,x,y,name,art)=><g key={id} className="park-attraction" transform={`translate(${x},${y})`} tabIndex="0" role="button" aria-label={`Visit ${name}`} onClick={e=>{e.stopPropagation();onEnter(id);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onEnter(id);}}}><rect className="attraction-hit" x="-80" y="-79" width="160" height="150" rx="12" fill="transparent"/>{art}<rect className="ride-sign" x="-76" y="48" width="152" height="24" rx="4"/><text textAnchor="middle" y="64" className="ride-sign-text">{name}</text></g>;
 return <>
  {ride(0,590,75,'Time Tunnel',<g><path d="M-50 35V4a50 48 0 0 1 100 0v31Z" fill="#a6a17f" stroke="#676a4f" strokeWidth="2"/>{[39,29,19].map((r,i)=><path key={r} d={`M${-r} 32V5a${r} ${r} 0 0 1 ${r*2} 0v27Z`} fill={i===2?'#605a69':'none'} stroke={i===2?'#d5bad5':'#e5d2b2'} strokeWidth="3"/>)}<path d="M-25 33l-7 17M25 33l7 17" stroke="#806975" strokeWidth="2"/></g>)}
  {ride(1,649,309,'Time Wheel',<g><ellipse cy="48" rx="68" ry="12" fill="#84936d" opacity=".25"/><circle cy="-15" r="60" fill="#eadfc833" stroke="#967e88" strokeWidth="2.5"/><circle cy="-15" r="53" fill="none" stroke="#c0a9ad" strokeWidth="1"/>{Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2,x=Math.cos(a)*60,y=-15+Math.sin(a)*60;return <g key={i}><path d={`M0-15L${x} ${y}`} stroke="#a29291" strokeWidth="1"/><rect x={x-6} y={y-3} width="12" height="10" rx="2" fill={i%2?'#c686a0':'#a3b8bc'} stroke="#80676f" strokeWidth="1"/></g>;})}<path d="M0-15L-27 46H27Z" fill="#e3d6b6" stroke="#86766e" strokeWidth="2"/><circle cy="-15" r="6" fill="#be8b9f"/></g>)}
  {ride(2,137,583,'Emotional Landscape',<g><path d="M-60 25Q-44-24-23 2Q8-45 28-8Q54-25 65 25Z" fill="#a6b89a" stroke="#7e926e" strokeWidth="1.5"/><path d="M-60 25Q-23-9 12 15T65 25" fill="none" stroke="#dee1bd" strokeWidth="2"/><path d="M-44 21v-19M46 18V-7" stroke="#85785d" strokeWidth="2"/><circle cx="-44" cy="-3" r="11" fill="#b5ba8e" stroke="#81916b"/><circle cx="46" cy="-10" r="13" fill="#a5b69a" stroke="#81916b"/></g>)}
  {ride(3,1030,555,'Emotion River',<g><path d="M-70 17Q0-18 70 17" fill="none" stroke="#698c92" strokeWidth="24"/><path d="M-70 17Q0-18 70 17" fill="none" stroke="#b4d0cb" strokeWidth="18"/><path d="M-33 21Q0-18 33 21L33 8Q0-32-33 8Z" fill="#d5bd9b" stroke="#927b63" strokeWidth="1.5"/>{[-28,-14,0,14,28].map(x=><line key={x} x1={x} x2={x} y1={Math.abs(x)*.42-14} y2={Math.abs(x)*.42-27} stroke="#927b63" strokeWidth="2"/>)}<path d="M-35-12Q0-48 35-12" fill="none" stroke="#927b63" strokeWidth="2"/></g>)}
  {ride(4,650,946,'Story Garden',<g><ellipse cy="10" rx="73" ry="30" fill="#abc09a" stroke="#7c946b" strokeWidth="1.5"/>{[-42,-21,0,21,42].map((x,i)=><g key={x} transform={`translate(${x},${i%2?0:15})`}><path d="M0 8v-18" stroke="#7c946b" strokeWidth="2"/>{[0,72,144,216,288].map(a=><ellipse key={a} cx="0" cy="-17" rx="3.5" ry="8" transform={`rotate(${a},0,-10)`} fill={i%2?'#d6a6b4':'#c5b3d1'} stroke="#968390" strokeWidth=".8"/>)}<circle cy="-10" r="3" fill="#efd7a8"/></g>)}</g>)}
 </>;
}

function WorldMap({islands,selected,theme,highlightThemes,query,comparison,connection,onPick,onHover,onEnter,tools}){
 const svg=useRef(),drawing=useRef();
 const path=d3.line().curve(d3.curveCatmullRomClosed.alpha(.5));
 const nodes=islands.flatMap(d=>d.films);
 const activeConnection=connection.shared.length?nodes.filter(n=>comparison.includes(n.film.id)):[];
 useEffect(()=>{
  const element=d3.select(svg.current);
  const zoom=d3.zoom().scaleExtent([.7,3.2]).filter(e=>e.type!=='wheel'&&!e.target.closest('.island-film, .park-attraction')).on('zoom',e=>d3.select(drawing.current).attr('transform',e.transform));
  element.call(zoom).on('dblclick.zoom',null);
  tools.current={zoom:factor=>element.transition().duration(window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:250).call(zoom.scaleBy,factor),reset:()=>element.transition().duration(250).call(zoom.transform,d3.zoomIdentity)};
  return()=>{element.on('.zoom',null);tools.current=null;};
 },[tools]);
 return <svg className="island-world" ref={svg} viewBox="-70 -100 1540 1200" role="group" aria-label="95 films in a connected amusement park, grouped by release decade. Drag to explore. Choose a film poster or attraction.">
  <defs>
   <pattern id="ocean-waves" width="130" height="97" patternUnits="userSpaceOnUse"><path d="M12 55q7 6 14 0q7 6 14 0" fill="none" stroke="#e8ece1" opacity=".3" strokeWidth="1.5" strokeLinecap="round"/></pattern>
   <filter id="island-paper"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="3" seed="17"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".15"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/><feComposite in2="SourceAlpha" operator="in"/></filter>
   <filter id="coast-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#2c4660" floodOpacity=".35"/></filter>
  </defs>
  <rect x="-2500" y="-2500" width="6000" height="6000" fill="#c6ceb0"/>
  <g ref={drawing}>
   <path d="M82 30Q700-28 1310 40Q1410 140 1410 480T1340 1008Q700 1060 95 994Q12 820 27 490T82 30Z" fill="#d0d5b8" stroke="#71815e" strokeWidth="3" filter="url(#island-paper)"/>
   <path d="M102 49Q700-8 1290 59Q1389 140 1389 480T1320 989Q700 1040 115 976Q33 820 48 490T102 49Z" fill="none" stroke="#85916e" strokeWidth="2" strokeDasharray="2 8"/>
   <path d="M190 178Q470 20 770 140T1180 205Q1320 345 1150 428T775 460Q525 635 252 431Q65 524 231 780Q380 999 763 760T1190 714Q1330 908 1070 961T650 973" fill="none" stroke="#9b9e7855" strokeWidth="24"/>
   <path d="M190 178Q470 20 770 140T1180 205Q1320 345 1150 428T775 460Q525 635 252 431Q65 524 231 780Q380 999 763 760T1190 714Q1330 908 1070 961T650 973" fill="none" stroke="#eee1b9" strokeWidth="18"/>
   <path d="M80 574C210 522 305 647 450 581S690 547 812 583S1040 523 1343 580" fill="none" stroke="#849c91" strokeWidth="36"/>
   <path d="M80 574C210 522 305 647 450 581S690 547 812 583S1040 523 1343 580" fill="none" stroke="#95b8bd" strokeWidth="27"/>
   <path d="M80 568C210 516 305 641 450 575S690 541 812 577S1040 517 1343 574" fill="none" stroke="#e4ece0" strokeWidth="1.5" opacity=".7"/>
   {islands.map((island,i)=><g key={island.decade} className="decade-island" data-decade={island.decade}>
    <path d={path(island.outline.map(([x,y])=>[island.cx+(x-island.cx)*.84,island.cy+(y-island.cy)*.82]))} fill={island.color} fillOpacity=".32"/>
    <text x={island.cx} y={island.cy-island.ry+31} textAnchor="middle" className="decade-title">{island.decade}s</text>
    <text x={island.cx} y={island.cy-island.ry+48} textAnchor="middle" className="island-count">{island.films.length} {island.films.length===1?'film':'films'}</text>
    <g className="island-vegetation" opacity=".45" fill="#809168" stroke="#687656" strokeWidth=".8">
     <path d={`M${island.cx-island.rx*.6} ${island.cy+island.ry*.25}l-7 14h14Z`}/><path d={`M${island.cx+island.rx*.64} ${island.cy+island.ry*.1}l-5 10h10Z`}/>
    </g>
    {island.films.length>2&&<path d={d3.line().curve(d3.curveCatmullRom.alpha(.6))(island.films.map(n=>[n.x,n.y+17]))} stroke="#9b8d69" strokeWidth="1" strokeDasharray="2 4" fill="none" opacity=".45"/>}
   </g>)}
   {/* A connection is drawn only for positive theme evidence in both films. */}
   {activeConnection.length===2&&<g className="shared-story-route"><path d={`M${activeConnection[0].x} ${activeConnection[0].y}Q700 ${Math.min(activeConnection[0].y,activeConnection[1].y)-170} ${activeConnection[1].x} ${activeConnection[1].y}`} fill="none" stroke="#fff6d7" strokeWidth="8" opacity=".7"/><path d={`M${activeConnection[0].x} ${activeConnection[0].y}Q700 ${Math.min(activeConnection[0].y,activeConnection[1].y)-170} ${activeConnection[1].x} ${activeConnection[1].y}`} fill="none" stroke="#a64b76" strokeWidth="2.5" strokeDasharray="7 5"/></g>}
   {nodes.map(node=><MovieResident key={node.film.id} node={node} selected={node.film.id===selected} comparison={comparison.includes(node.film.id)} highlighted={(!highlightThemes||(node.film.themes.length>0&&(!theme||node.film.themes.some(t=>t.theme===theme))))&&(!query||node.film.title.toLowerCase().includes(query.toLowerCase()))} onPick={onPick} onHover={onHover}/>)}
   <ParkLandmarks onEnter={onEnter}/>
   <g className="world-compass" transform="translate(1330 351)"><path d="M0-30L6-6 0 0-6-6ZM0 30L-6 6 0 0 6 6ZM-30 0L-6-6 0 0-6 6ZM30 0L6 6 0 0 6-6Z" fill="#80906a" fillOpacity=".6" stroke="#f2e7d8" strokeWidth=".8"/><text y="-40" textAnchor="middle">N</text></g>
  </g>
 </svg>;
}

export function StoryPark({films,selected,onSelect,onEnter}){
 const islands=useMemo(()=>islandLayout(films),[films]);
 const [mode,setMode]=useState('time'),[theme,setTheme]=useState(''),[query,setQuery]=useState(''),[hovered,setHovered]=useState(null),[compareFrom,setCompareFrom]=useState(null),[compareTo,setCompareTo]=useState(null);
 const tools=useRef(null);
 const picked=films.find(f=>f.id===selected)||films[0];
 const anchor=films.find(f=>f.id===compareFrom),second=films.find(f=>f.id===compareTo);
 const connection=documentedConnection(anchor,second);
 const hoveredFilm=films.find(f=>f.id===hovered);
 const coded=films.filter(f=>f.themes.length).length;
 const results=query?films.filter(f=>f.title.toLowerCase().includes(query.toLowerCase())).slice(0,6):[];
 const choose=id=>{onSelect(id);setQuery('');if(compareFrom&&id!==compareFrom)setCompareTo(id);};
 const chooseMode=value=>{setMode(value);if(value==='time')setTheme('');};
 return <main className="story-islands story-park-world">
  <section className="island-scene" aria-label="Growing Up with Magic amusement park">
   <WorldMap islands={islands} onEnter={onEnter} highlightThemes={mode==='themes'} selected={selected} theme={mode==='themes'?theme:''} query={query} comparison={[compareFrom,compareTo].filter(Boolean)} connection={connection} onPick={choose} onHover={setHovered} tools={tools}/>
   <header className="world-header"><div className="world-brand"><span>A DISNEY + PIXAR STORY PARK</span><h1>Growing Up<br/>with <em>Magic</em></h1><p>95 films. A whole world of growing up.</p></div><div className="world-top-tools"><div className="world-search"><label htmlFor="world-film-search">Find your film</label><input id="world-film-search" type="search" value={query} placeholder="Try Inside Out…" autoComplete="off" onChange={e=>setQuery(e.target.value)}/>{query&&<div className="world-search-results">{results.length?results.map(f=><button key={f.id} onClick={()=>choose(f.id)}>{f.title}<span>{f.year} · {f.studio}</span></button>):<p>No film titles match.</p>}</div>}</div><button className="world-open-atlas" onClick={()=>onEnter(0)}>Open the film atlas</button></div></header>
   <div className="world-mode-panel"><div className="world-mode-switch" role="group" aria-label="Explore by time or theme"><button aria-pressed={mode==='time'} onClick={()=>chooseMode('time')}>Follow time</button><button aria-pressed={mode==='themes'} onClick={()=>chooseMode('themes')}>Follow a feeling</button></div>{mode==='themes'?<label className="world-theme-picker">Highlight a documented theme<select value={theme} onChange={e=>setTheme(e.target.value)}><option value="">All documented themes</option>{themeNames.map(t=><option key={t}>{t}</option>)}</select></label>:<p>Each neighbourhood is a release decade.<br/>Choose a little poster to meet a film.</p>}{mode==='themes'&&<p>{theme?films.filter(f=>f.themes.some(t=>t.theme===theme)).length:coded} films with {theme||'partial theme coding'}.<br/>Uncoded films stay visible and are unknown.</p>}</div>
   <div className="world-zoom-tools" role="group" aria-label="Map zoom"><button aria-label="Zoom into the story park" onClick={()=>tools.current?.zoom(1.35)}>+</button><button aria-label="Zoom out of the story park" onClick={()=>tools.current?.zoom(1/1.35)}>−</button><button onClick={()=>tools.current?.reset()}>Reset map</button></div>
   {hoveredFilm&&<div className="world-hover-card" role="status"><strong>{hoveredFilm.title}</strong><span>{hoveredFilm.year} · {hoveredFilm.studio}</span></div>}
   {compareFrom&&!compareTo&&<div className="comparison-prompt" role="status">Taking <b>{anchor.title}</b> with you. Choose another film to compare.<button onClick={()=>{setCompareFrom(null);setCompareTo(null);}}>Cancel</button></div>}
   {anchor&&second&&<div className="comparison-prompt" role="status"><b>{connection.shared.length?`Shared themes: ${connection.shared.join(', ')}`:connection.status==='needs_coding'?'More theme evidence is needed.':'No shared themes in the current annotations.'}</b><button onClick={()=>document.getElementById('story-comparison')?.scrollIntoView({behavior:'smooth',block:'center'})}>Read this comparison</button></div>}
   <div className="world-map-key"><span className="disney-key">● Disney Animation</span><span className="pixar-key">◆ Pixar</span><small>One poster marker = one film · Drag to explore</small></div>
   <div className="world-caption">An illustrated amusement park. Each poster is a real film; terrain and buildings are illustrative.</div>
  </section>
  <section className="island-story-dock" aria-label="Selected film and documented connections" aria-live="polite"><div className="dock-film"><Poster key={picked.id} filmId={picked.id}/><div><span className="dock-kicker">YOUR STORY COMPANION</span><h2>{picked.title}</h2><p>{picked.studio} · {picked.year}<br/>{picked.life_stages.map(s=>s.life_stage).join(' · ')||'Life stages not yet coded'}</p></div></div><div className="dock-themes"><span className="dock-kicker">DOCUMENTED THEMES</span><div>{picked.themes.length?picked.themes.map(t=><span key={t.theme} style={{'--theme-color':themeColor(t.theme)}}>{t.theme}</span>):<p>Not yet theme-coded. Missing evidence is unknown.</p>}</div><button onClick={()=>{setCompareFrom(picked.id);setCompareTo(null);document.querySelector(".island-scene")?.scrollIntoView({behavior:"smooth"});}}>Compare with another film</button></div><button className="dock-enter" onClick={()=>onEnter(0)}>Explore this film</button></section>
  {anchor&&second&&<section id="story-comparison" className="island-comparison" aria-live="polite"><div><span className="dock-kicker">A STORY PATH ACROSS TIME</span><h2>{anchor.title} <em>and</em> {second.title}</h2></div><div>{connection.status==='shared_documented_themes'?<><p>Shared documented themes: <b>{connection.shared.join(' · ')}</b></p><p>{anchor.year}: {anchor.life_stages.map(s=>s.life_stage).join(' · ')||'life stage not coded'}<br/>{second.year}: {second.life_stages.map(s=>s.life_stage).join(' · ')||'life stage not coded'}</p></>:<p>{connection.status==='needs_coding'?'One or both films need theme coding before an evidence-based connection can be drawn.':'No shared themes are recorded in the current partial annotations. This does not establish that the films have nothing in common.'}</p>}<small>Connections reflect partial annotations, not emotional intensity or a complete historical trend.</small></div><button onClick={()=>{setCompareFrom(null);setCompareTo(null);}}>Clear comparison</button></section>}
  <section className="island-attractions"><div className="island-attraction-heading"><span>BEYOND THE MAP</span><h2>There is more than one way<br/>to follow a story.</h2><p>Keep your selected film as you step into the connected atlas.</p></div><div className="island-attraction-links">{attractionNames.map((name,i)=><button key={name} onClick={()=>onEnter(i)}><span>{String(i+1).padStart(2,'0')}</span><strong>{name}</strong><small>{i<2?'Explore film history':i===4?'Turn posters into emotional flowers':'Compare documented themes'}</small></button>)}</div></section>
  <footer className="island-footer"><div><b>{coded} / {films.length}</b><span>films with partial theme coding.<br/>Human second review is pending.</span></div><p>Film Time is when a film was released. Story Life is the stage of life represented in its story. This map does not measure a viewer’s age or feelings.</p><p>Growing Up with Magic · Jieyi Shang<br/>Poster artwork © Disney / Pixar. <a href={posters[picked.id]?.file_source||posters[picked.id]?.source} target="_blank" rel="noreferrer">Selected artwork source</a>. Film notes contain source links and evidence.</p></footer>
 </main>;
}
