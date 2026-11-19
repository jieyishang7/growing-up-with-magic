import React, {useMemo, useState} from 'react';
import * as d3 from 'd3';
import {Poster, posters} from './Posters.jsx';
import {themeNames, themeColor, timePosition} from './model.js';
import {FlowerPortrait} from './StoryViews.jsx';
import './park.css';

const rides = [
  {id:0, name:'Time Tunnel', subtitle:'Where our stories begin', x:20, y:44, kind:'FILM TIME'},
  {id:1, name:'Time Wheel', subtitle:'A turn through film history', x:73, y:44, kind:'FILM TIME'},
  {id:2, name:'Emotional Landscape', subtitle:'Find stories that feel connected', x:19, y:74, kind:'STORY LIFE'},
  {id:3, name:'Emotion River', subtitle:'Follow documented themes', x:76, y:76, kind:'FILM TIME × THEMES'},
  {id:4, name:'Story Garden', subtitle:'A poster. A flower. A story.', x:47, y:91, kind:'STORY LIFE'},
];
const stopTitles = ['Snow White and the Seven Dwarfs','Pinocchio','Cinderella','Sleeping Beauty','The Jungle Book','The Rescuers','The Little Mermaid','Toy Story','Finding Nemo','Up','Inside Out','Coco','Turning Red','Toy Story 5'];
const ink = film => film.studio==='Pixar' ? '#83b7f8' : '#ed83bc';

function ParkDrawing({films, selected, positions}) {
  const coded = films.filter(f=>f.themes.length);
  const ordered = [...films].sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));
  const line = d3.line().curve(d3.curveCatmullRom.alpha(.65));
  return <svg className="park-drawing" viewBox="0 0 1200 660" aria-hidden="true">
    <defs>
      <radialGradient id="park-ground"><stop stopColor="#30244c" stopOpacity=".5"/><stop offset="1" stopColor="#0b1029" stopOpacity="0"/></radialGradient>
      <linearGradient id="park-path"><stop stopColor="#d781ba"/><stop offset=".5" stopColor="#ab97e7"/><stop offset="1" stopColor="#78b8ce"/></linearGradient>
      <filter id="park-glow"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <ellipse cx="600" cy="340" rx="570" ry="290" fill="url(#park-ground)"/>
    <path d="M79 337C-10 214 137 59 342 91S562 38 731 53S1118 117 1129 279S1158 480 985 529S809 621 607 620S398 618 261 571S82 476 79 337Z" fill="#171a3433" stroke="#b092dd22"/>
    <path d="M117 359C50 254 171 96 350 123S585 68 748 85S1080 141 1092 279S1100 445 970 489S798 586 608 582S422 580 280 535S125 469 117 359Z" fill="none" stroke="#b092dd16" strokeDasharray="3 9"/>
    <path d="M252 209C345 178 404 136 507 178S542 324 671 250S841 199 897 255S808 367 671 380S571 342 486 399S304 428 295 475S405 547 535 527S660 446 791 470S957 480 1012 408" fill="none" stroke="url(#park-path)" strokeWidth="26" opacity=".045"/>
    <path d="M252 209C345 178 404 136 507 178S542 324 671 250S841 199 897 255S808 367 671 380S571 342 486 399S304 428 295 475S405 547 535 527S660 446 791 470S957 480 1012 408" fill="none" stroke="url(#park-path)" strokeWidth="1.4" strokeDasharray="3 7" opacity=".6"/>
    {/* The tunnel's rings are guides; its marks are the actual film records. */}
    <g transform="translate(250 195)">
      {d3.range(16).map(i=><ellipse key={i} cy={i*1.7} rx={25+i*6.6} ry={14+i*3.8} fill="none" stroke={i%3?'#c773be':'#9c85dd'} strokeWidth=".7" opacity={.25+i*.025}/>)}
      {ordered.map((f,i)=>{const [x,y]=timePosition(f,i,0,ordered,positions);return <circle key={f.id} cx={(x-500)*.34} cy={(y-280)*.34} r={f.id===selected?3.5:1.7} fill={ink(f)}/>;})}
      <text y="5" textAnchor="middle" className="park-year">1937</text>
      <path d="M-58 81v-20q58-36 116 0v20M-63 82h126" stroke="#d9a0d7" strokeWidth="1.3" fill="none"/>
    </g>
    {/* Each wheel cabin is one film, placed by release order. */}
    <g transform="translate(872 166)">
      <ellipse cy="127" rx="125" ry="16" fill="#9f77d1" opacity=".08"/>
      <circle r="110" fill="#b399e804" stroke="#c2a4e0" strokeWidth="1.2"/>
      <circle r="103" fill="none" stroke="#9f8ace" strokeWidth=".6"/>
      {d3.range(0,360,30).map(a=><line key={a} x1="0" y1="0" x2={Math.cos(a*Math.PI/180)*110} y2={Math.sin(a*Math.PI/180)*110} stroke="#9c7dc2" strokeWidth=".6" opacity=".6"/>)}
      <path d="M0 0L-47 126H47Z" fill="#171a30" fillOpacity=".6" stroke="#ae91d0" strokeWidth="1.2"/>
      {ordered.map((f,i)=>{const a=-Math.PI/2+i/ordered.length*Math.PI*2;return <rect key={f.id} x={Math.cos(a)*110-2.2} y={Math.sin(a)*110-2.2} width="4.4" height="4.4" rx="1" fill={ink(f)} opacity={f.id===selected?1:.8}/>;})}
      <circle r="13" fill="#17162f" stroke="#e6bdde"/>
      <path d="M-5 0h10M0-5v10" stroke="#edc0e1"/>
    </g>
    <g transform="translate(75 321)">
      {[0,1,2,3,4].map(i=><path key={i} d={`M0 ${70+i*5}Q70 ${-50+i*18} 145 ${15+i*11}T300 ${70+i*5}L300 160H0Z`} fill={i===0?'#7d68b815':'none'} stroke={i%2?'#b083c2':'#9284d1'} strokeWidth=".7" opacity=".4"/>)}
      {coded.map(f=>{const p=positions.get(f.id);return <circle key={f.id} cx={(p[0]-220)*.5} cy={(p[1]-120)*.4} r={f.id===selected?4:2.5} fill={ink(f)}/>;})}
      <path d="M23 137l7-18 7 18M31 122v30M261 127l7-18 7 18M269 112v30" fill="none" stroke="#9db5b5" opacity=".7"/>
    </g>
    <g transform="translate(713 319)">
      <path d="M-44 9C34-20 78 95 146 62S244 18 290 91S290 151 349 166" fill="none" stroke="#72a6bf" strokeWidth="28" opacity=".055"/>
      {themeNames.map((t,i)=>{const members=coded.filter(f=>f.themes.some(r=>r.theme===t)).sort((a,b)=>a.year-b.year);if(!members.length)return null;const pts=[[-44,9+i*2],...members.map(f=>[(f.year-2000)/26*230,72+Math.sin((f.year-2000)/8+i*.06)*37+i*1.3]),[349,166+i*1.5]];return <path key={t} d={line(pts)} fill="none" stroke={themeColor(t)} strokeWidth=".8" opacity=".6"/>;})}
      <path d="M70 76q14-21 30 0M70 80q14-21 30 0M73 73v-8M97 73v-8" fill="none" stroke="#d5afcf"/>
    </g>
    <g transform="translate(555 467)">
      <ellipse cy="40" rx="82" ry="33" fill="#bf7fa812" stroke="#bd9ad14d"/>
      {coded.slice(0,7).map((f,i)=>{const x=(i%4)*33-49,y=Math.floor(i/4)*34;return <g key={f.id} transform={`translate(${x},${y})`}><path d="M0 0q-4 13 0 22" fill="none" stroke="#a1bab9" strokeWidth=".7"/>{f.themes.map(t=><ellipse key={t.theme} cx="0" cy="-6" rx="3" ry="7" transform={`rotate(${themeNames.indexOf(t.theme)*36})`} fill={themeColor(t.theme)} fillOpacity=".35" stroke={themeColor(t.theme)} strokeWidth=".5"/>)}<circle r="2" fill={ink(f)}/></g>;})}
    </g>
    <g className="park-sign"><path d="M543 315v-28h114v28M551 287v-15h98v15M550 278h100" fill="none" stroke="#a58cb9" strokeWidth="1.2"/><text x="600" y="307" textAnchor="middle">THE STORY CROSSING</text></g>
    <g fill="#c3a5dc" opacity=".5">{[[451,83],[629,113],[1083,361],[135,469],[369,541],[696,564]].map(([x,y],i)=><path key={i} d={`M${x} ${y-5}v10M${x-5} ${y}h10`} stroke="#c3a5dc" strokeWidth=".6"/>)}</g>
  </svg>;
}

function StoryWalk({films,selected,onSelect,onEnter}) {
  const [expanded,setExpanded]=useState(false);
  const ordered=useMemo(()=>[...films].sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id)),[films]);
  const stops=expanded?ordered:stopTitles.map(t=>ordered.find(f=>f.title===t)).filter(Boolean);
  return <section className="story-walk" aria-labelledby="walk-title">
    <div className="walk-heading"><div><span className="park-kicker">THE STORY WALK</span><h2 id="walk-title">Familiar faces. New discoveries.</h2><p>A few stops across the archive. Choose a film to take it with you.</p></div><button className="park-outline" onClick={()=>setExpanded(!expanded)}>{expanded?'Show selected stops':`Walk through all ${films.length} films`}</button></div>
    <div className="walk-stops">{stops.map((f,i)=><button key={f.id} style={{"--walk-row":Math.floor(i/7)+1,"--walk-column":Math.floor(i/7)%2===0?i%7+1:7-i%7}} className={`walk-stop ${f.id===selected?'is-selected':''}`} onClick={()=>onSelect(f.id)} aria-pressed={f.id===selected} aria-label={`Take ${f.title}, ${f.year} with you`}><span className="walk-image"><Poster filmId={f.id}/></span><span className="walk-dot" style={{'--studio-ink':ink(f)}}/><span className="walk-year">{f.year}</span><strong>{f.title}</strong><small>{f.studio==='Pixar'?'Pixar':'Disney Animation'}</small></button>)}</div>
    <div className="walk-footnote"><span>Stops follow release order; spacing does not represent elapsed time.</span><button onClick={()=>onEnter(0)}>Explore the full timeline</button></div>
  </section>;
}

export function ParkEntrance({films,positions,selected,onSelect,onEnter}) {
  const picked=films.find(f=>f.id===selected)||films[0];
  const coded=films.filter(f=>f.themes.length).length;
  const [rideFocus,setRideFocus]=useState(null);
  return <main className="magic-park">
    <header className="park-header"><a className="park-wordmark" href="#park-top">Growing Up with Magic<span>A VISUAL PARK OF HUMAN EXPERIENCE</span></a><div className="park-header-right"><span>DISNEY ANIMATION + PIXAR</span><button className="park-outline" onClick={()=>onEnter(0)}>Enter the film atlas</button></div></header>
    <section id="park-top" className="park-intro"><div><span className="park-kicker">THE PARK IS OPEN · 1937–2026</span><h1>Every story is<br/>a place to <em>grow.</em></h1></div><div className="park-welcome"><p>Wander through {films.length} animated films.<br/>Find the feelings, ages, and stories<br/>that stay with us.</p><div className="park-studio-key"><span>● Disney Animation</span><span>◆ Pixar</span></div></div></section>
    <section className="park-map" aria-label="Choose a ride on the story park map">
      <div className="park-map-caption"><span>YOUR PARK MAP</span><span>Choose an attraction to explore</span></div>
      <ParkDrawing films={films} selected={selected} positions={positions}/>
      {rides.map(r=><button key={r.id} className={`park-ride ride-${r.id} ${rideFocus===r.id?'is-lit':''}`} style={{left:`${r.x}%`,top:`${r.y}%`}} onMouseEnter={()=>setRideFocus(r.id)} onMouseLeave={()=>setRideFocus(null)} onFocus={()=>setRideFocus(r.id)} onBlur={()=>setRideFocus(null)} onClick={()=>onEnter(r.id)}><span className="ride-type">{r.kind}</span><strong>{r.name}</strong><span>{r.subtitle}</span><span className="ride-enter">Explore this attraction</span></button>)}
      <div className="park-map-note">An illustrated map of the atlas. Each attraction opens a real data view.</div>
    </section>
    <div className="park-reading-strip"><div><b>{films.length}</b><span>films in the archive</span></div><div><b>{coded} / {films.length}</b><span>films with partial theme coding</span></div><p>Theme attractions explore documented examples.<br/>Uncoded films are unknown, not emotionless. Human review is pending.</p></div>
    <StoryWalk films={films} selected={selected} onSelect={id=>{onSelect(id);requestAnimationFrame(()=>document.getElementById('park-story-pass')?.scrollIntoView({behavior:'smooth',block:'center'}));}} onEnter={onEnter}/>
    <section id="park-story-pass" className="park-pass" aria-live="polite"><div className="pass-film"><Poster key={picked.id} filmId={picked.id}/><div><span className="park-kicker">YOUR STORY COMPANION</span><h2>{picked.title}</h2><span className="pass-meta">{picked.studio} · {picked.year}</span><p>{picked.life_stages.map(s=>s.life_stage).join(' · ')||'Life-stage evidence not yet coded'}</p></div></div><div className="pass-themes">{picked.themes.length?<><span className="park-kicker">DOCUMENTED THEMES</span><div>{picked.themes.map(t=><span key={t.theme} style={{color:themeColor(t.theme)}}>{t.theme}</span>)}</div></>:<p>Theme evidence is not yet coded for this film.</p>}<button className="park-primary" onClick={()=>onEnter(0)}>Follow this film through the atlas</button></div>{picked.themes.length>0&&<div className="pass-flower"><FlowerPortrait f={picked}/></div>}</section>
    <footer className="park-footer"><span>Growing Up with Magic · Jieyi Shang</span><p>Poster artwork © Disney / Pixar. <a href={posters[picked.id]?.file_source||posters[picked.id]?.source} target="_blank" rel="noreferrer">Selected poster source and rights</a>. Source links and evidence accompany each film in the atlas.</p><button onClick={()=>onEnter(4)}>Visit the story garden</button></footer>
  </main>;
}
