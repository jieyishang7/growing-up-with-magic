import React,{useState} from 'react';
export const posters={
 'pixar-inside-out':{title:'Inside Out',src:'https://lumiere-a.akamaihd.net/v1/images/p_insideout_19751_af12286c.jpeg',source:'https://movies.disney.com/inside-out'},
 'pixar-finding-nemo':{title:'Finding Nemo',src:'https://lumiere-a.akamaihd.net/v1/images/p_findingnemo_19752_05271d3f.jpeg',source:'https://movies.disney.com/finding-nemo'},
 'pixar-up':{title:'Up',src:'https://lumiere-a.akamaihd.net/v1/images/p_up_19753_e6f911e3.jpeg',source:'https://movies.disney.com/up'},
 'pixar-coco':{title:'Coco',src:'https://lumiere-a.akamaihd.net/v1/images/p_coco_19736_fd5fa537.jpeg',source:'https://movies.disney.com/coco'},
 'disney-frozen':{title:'Frozen',src:'https://lumiere-a.akamaihd.net/v1/images/p_frozen_18373_3131259c.jpeg',source:'https://movies.disney.com/frozen'}
};
export function Poster({filmId,className='',credit=false}){const [failed,setFailed]=useState(false);const p=posters[filmId];if(!p)return null;return <figure className={`film-poster ${className}`}>{!failed?<img key={p.src} src={p.src} alt={`${p.title} promotional poster`} loading="lazy" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>:<div className="poster-fallback">{p.title}<small>Poster unavailable</small></div>}{credit&&<figcaption><a href={p.source} target="_blank" rel="noreferrer">Official poster source ↗</a><span>© Disney / Pixar</span></figcaption>}</figure>;}
