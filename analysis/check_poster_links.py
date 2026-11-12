"""Check remote poster reference headers without downloading image bodies."""
import json,urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parents[1]
def check(item):
 key,p=item
 try:
  req=urllib.request.Request(p['src'],headers={'User-Agent':'GrowingUpWithMagicAcademicPreview/1.0'},method='HEAD')
  with urllib.request.urlopen(req,timeout=12) as r:return key,{'status':r.status,'content_type':r.headers.get('Content-Type','')}
 except Exception as e:return key,{'error':str(e)}
if __name__=='__main__':
 data=json.loads((ROOT/'src/posters-data.json').read_text())
 result={}
 for item in data.items():
  key,record=check(item);result[key]=record
  if '429' in record.get('error',''):break  # Respect rate limits; do not retry or keep probing.
  import time;time.sleep(1)
 (ROOT/'sources/poster_link_checks.json').write_text(json.dumps({'checked_at':'2026-11-12','method':'HEAD only','results':result},indent=2)+'\n')
 print(json.dumps({'image_links_ok':sum(v.get('status')==200 and v.get('content_type','').startswith('image/') for v in result.values()),'failures':{k:v for k,v in result.items() if v.get('status')!=200}},indent=2))
