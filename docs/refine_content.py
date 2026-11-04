import json,sys,re
from pathlib import Path
sys.path.insert(0,'.research-libs')
from bs4 import BeautifulSoup
p=Path('src/content/site.json'); d=json.loads(p.read_text(encoding='utf8'))
for page in [d['home']]+d['pages']:
 page['images']=[im for im in page['images'] if Path('public'+im['src']).exists()]
 # Keep source testimonials intact, but discard repeated carousel slides.
 seen=set(); ps=[]
 for t in page['paragraphs']:
  key=re.sub(r'[^a-z0-9]','',t.lower())
  if key not in seen: ps.append(t); seen.add(key)
 page['paragraphs']=ps
page=next(p for p in d['pages'] if p['slug']=='press')
s=BeautifulSoup(Path('src/content/raw/press.html').read_text(encoding='utf8'),'html.parser')
page['links']=[]
for a in s.select('main a[href]'):
 u=a.get('href','')
 if u.startswith('https://') and 'rivingtonmarx.com' not in u:
  parent=a.find_parent(class_='fusion-column-wrapper')
  label=parent.get_text(' ',strip=True) if parent else ''
  im=a.find('img')
  label=label or (im.get('alt') if im else '') or u.split('/')[2]
  page['links'].append({'label':label,'url':u})
p.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
print('Ready:',len(d['pages']),'pages. Missing asset removed from press record (source image unavailable).')
print([(p['slug'],p['title'],len(p['images'])) for p in d['pages'] if p['kind']=='project'])
