"""Acquire poster REFERENCES only, with film/year and infobox-caption evidence.
Requires saved Wikipedia film-list HTML in work/posters/. Does not download images.
"""
import csv,json,re,html,time,urllib.request,hashlib
from pathlib import Path
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor,as_completed
ROOT=Path(__file__).resolve().parents[1];CACHE=ROOT/'work/posters';CACHE.mkdir(parents=True,exist_ok=True)
def norm(s):return re.sub('[^a-z0-9]','',s.lower())
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.a=None;self.text=''
 def handle_starttag(self,t,attrs):
  if t=='a':self.a=dict(attrs);self.text=''
 def handle_data(self,d):
  if self.a is not None:self.text+=d
 def handle_endtag(self,t):
  if t=='a' and self.a is not None:
   href=self.a.get('href','');href=href.replace('https://en.wikipedia.org','')
   if href.startswith('/wiki/') and not re.search(r'/wiki/(File|Category|Help|Wikipedia|Template|Special|Portal|Talk):',href) and '#' not in href:self.links.append((self.text.strip(),'https://en.wikipedia.org'+href))
   self.a=None
class Img(HTMLParser):
 def __init__(self):super().__init__();self.images=[]
 def handle_starttag(self,t,a):
  if t=='img':self.images.append(dict(a))
def fetch(url,key):
 p=CACHE/(key+'.html')
 if p.exists():return p.read_text()
 req=urllib.request.Request(url,headers={'User-Agent':'GrowingUpWithMagicAcademicPreview/1.0 (film reference verification)'})
 with urllib.request.urlopen(req,timeout=30) as r: raw=r.read().decode()
 p.write_text(raw);time.sleep(.25);return raw

def main():
 films=list(csv.DictReader((ROOT/'data/processed/films_master.csv').open()));links=[]
 for key in ['wiki-disney','wiki-pixar']:
  p=Links();p.feed((CACHE/(key+'.html')).read_text());links+=p.links
 lookup={}
 for title,url in links:lookup.setdefault(norm(title),set()).add(url)
 manifest={};errors={}
 def process(f):
  candidates=lookup.get(norm(f['title']),set())
  candidates=sorted(candidates,key=lambda u:(('franchise' in u),f"{f['year']}_film" not in u,len(u)))
  if not candidates:return f['id'],None,'no_title_match'
  url=candidates[0]
  try:
   raw=fetch(url,'film-'+f['id']);text=html.unescape(re.sub('<[^>]+>',' ',raw))
   box=re.search(r'<td[^>]*class="infobox-image"[^>]*>(.*?)</td>',raw,re.S)
   if not box:return f['id'],None,'no_infobox_image '+url
   image=Img();image.feed(box[0]);im=next((i for i in image.images if 'wikimedia.org' in i.get('src','')),None)
   if not im:return f['id'],None,'no_image_url '+url
   w,h=int(im.get('width','0')),int(im.get('height','0'))
   if not h or not .45<w/h<.9:return f['id'],None,'not_portrait '+url
   # Exact title was matched in the film list, then its year must appear in release evidence.
   released=re.search(r'Release dates?.{0,100}?</th>\s*<td[^>]*>(.*?)</td>',raw,re.S)
   evidence=html.unescape(re.sub('<[^>]+>',' ',released[1])) if released else ''
   if f['year'] not in evidence:return f['id'],None,'year_not_verified '+url+' '+evidence[:130]
   cap=re.search(r'class="infobox-caption"[^>]*>(.*?)</div>',box[0],re.S)
   caption=html.unescape(re.sub('<[^>]+>',' ',cap[1])).strip() if cap else ''
   src=next((v.split()[0] for v in im.get('srcset','').split(',') if 'upload.wikimedia.org' in v),im['src']);src=html.unescape(src).split('?')[0];src='https:'+src if src.startswith('//') else src
   fileurl=im.get('resource','');fileurl=fileurl.replace('./','https://en.wikipedia.org/wiki/')
   if not fileurl.startswith('https:'):fileurl='https://en.wikipedia.org/wiki/'+fileurl.lstrip('/')
   is_reissue=bool(re.search(r're.?release|reissue|anniversary|restor',caption,re.I))
   version='theatrical_release_poster' if 'theatrical' in caption.lower() and not is_reissue else 'reissue_poster' if is_reissue else 'poster_version_pending_review'
   return f['id'],dict(title=f['title'],year=int(f['year']),src=src,source=url,file_source=fileurl,caption=caption,version=version,credit='Disney / Pixar' if f['studio']=='Pixar' else 'Disney',review_status='title_year_caption_checked; image_edition_not_independently_reviewed',release_evidence=' '.join(evidence.split()),accessed='2026-11-12',source_sha256=hashlib.sha256(raw.encode()).hexdigest()),None
  except Exception as e:return f['id'],None,str(e)+' '+url
 with ThreadPoolExecutor(max_workers=3) as pool:
  for future in as_completed([pool.submit(process,f) for f in films]):
   key,record,error=future.result()
   if record:manifest[key]=record
   else:errors[key]=error
   if (len(manifest)+len(errors))%15==0:print('Processed',len(manifest)+len(errors),'matched',len(manifest),flush=True)
 assert len(manifest)==95, 'Incomplete acquisition; previous manifest preserved'
 (ROOT/'src/posters-data.json').write_text(json.dumps(dict(sorted(manifest.items())),indent=2,ensure_ascii=False)+'\n')
 (ROOT/'sources/poster_acquisition.json').write_text(json.dumps({'accessed':'2026-11-12','matched':len(manifest),'missing':errors,'version_counts':{k:sum(r['version']==k for r in manifest.values()) for k in set(r['version'] for r in manifest.values())}},indent=2)+'\n')
 print(json.dumps({'matched':len(manifest),'errors':errors},indent=2))
if __name__=='__main__':main()
