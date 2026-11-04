import sys,json,subprocess,re,base64,concurrent.futures
from pathlib import Path
from urllib.parse import unquote,urlparse
sys.path.insert(0,'.research-libs')
from bs4 import BeautifulSoup
ROOT='https://rivingtonmarx.com/'
cache=Path('src/content/raw'); cache.mkdir(exist_ok=True)
def fetch(url):
 p=cache/((urlparse(url).path.strip('/') or 'home').replace('/','__')+'.html')
 if not p.exists(): subprocess.run(['curl.exe','-fsSL',url,'-o',str(p)],capture_output=True)
 return BeautifulSoup(p.read_text(encoding='utf8') if p.exists() else '', 'html.parser')
s=fetch(ROOT)
links={a.get('href'):a.get_text(' ',strip=True) for a in s.select('nav a') if a.get('href','').startswith(ROOT) and not a.get('href','').endswith(('.xml','.html'))}
list(concurrent.futures.ThreadPoolExecutor(8).map(fetch,links))
for url in [ROOT+'projects/',ROOT+'blog/']:
 ss=fetch(url); main=ss.select_one('main') or ss
 print(url,[(a.get_text(' ',strip=True)[:90],a.get('href')) for a in main.select('a') if a.get('href','').startswith(ROOT)])
print('SITEMAP',fetch(ROOT+'sitemap_index.xml').get_text(' ',strip=True)[:4000])
for sm in ['post-sitemap.xml','page-sitemap.xml','avada_portfolio-sitemap.xml']:
 for loc in fetch(ROOT+sm).select('loc'):
  u=loc.get_text()
  if u.startswith(ROOT) and '/wp-content/' not in u: links.setdefault(u,'')
list(concurrent.futures.ThreadPoolExecutor(8).map(fetch,links))
for u in links:
 ss=fetch(u); main=ss.select_one('main') or ss
 ps=[p.get_text(' ',strip=True) for p in main.select('p') if len(p.get_text(' ',strip=True))>35]
 print(u, len(ps), (main.select_one('h1').get_text(' ',strip=True) if main.select_one('h1') else ''), ps[:1])
from PIL import Image
import io,hashlib

def clean(t): return re.sub(r'\s+',' ',t).strip().replace('\ufffd',"'")
def imgurl(el):
 src=el.get('src','')
 if 'base64,' in src:
  try:
   svg=BeautifulSoup(base64.b64decode(src.split('base64,')[1]),'html.parser').find('svg'); return unquote(svg.get('data-u',''))
  except: return ''
 return src if src.startswith('http') else ''
assets={}
def image_record(url,alt):
 name=hashlib.sha1(url.encode()).hexdigest()[:12]+'.webp'
 assets.setdefault(url,name)
 return {'src':'/images/'+name,'alt':clean(alt),'sourceUrl':url}
def record(u):
 ss=fetch(u); main=ss.select_one('main') or ss
 for node in main.select('.fusion-post-title-meta-wrap,.fusion-meta-info,.related-posts,.fusion-sharing-box,script,style,form'): node.decompose()
 h=main.select_one('h1'); title=clean(h.get_text(' ',strip=True)) if h else links.get(u,'')
 slug=urlparse(u).path.strip('/'); slug='portfolio' if slug=='projects' else slug
 kind='project' if slug.startswith('project/') else 'service' if slug.startswith('services/') else 'article' if slug.startswith('blog/') else 'page'
 ps=[]; blocks=[]
 for el in main.select('h2,h3,h4,p,li'):
  t=clean(el.get_text(' ',strip=True))
  if len(t)>2 and t not in ps and not el.find_parent(['li','p']) and not t.startswith(('Related Projects','Share This Story','By Rivington','By Chandra')):
   ps.append(t); blocks.append({'type':'heading' if el.name.startswith('h') else 'paragraph','text':t})
 ims=[]
 for im in main.select('img'):
  src=imgurl(im)
  if src and '/uploads/' in src and not any(x in src.lower() for x in ['logo','icon-','avatar']) and int(im.get('width',1000) or 1000)>200 and src not in [x['sourceUrl'] for x in ims]:
   ims.append(image_record(src,im.get('alt') or title))
 # Prefer project gallery photography; don't carry related-project thumbnails.
 if kind=='project':
  gallery=[]
  for a in main.select('a[href]'):
   src=a.get('href','')
   if re.search(r'\.(jpg|jpeg|png|webp)$',src,re.I) and '/uploads/' in src and src not in [x['sourceUrl'] for x in gallery]: gallery.append(image_record(src,a.get('data-caption') or (a.find('img').get('alt') if a.find('img') else title)))
  if gallery: ims=gallery
 # Keep a curated, useful collection per page; all original raw documents retained.
 ims=ims[:10 if kind=='project' else 4]
 meta=ss.select_one('meta[name="description"]'); desc=clean(meta.get('content','')) if meta else next((p for p in ps if len(p)>80),'')
 return {'slug':slug,'title':title,'description':desc,'paragraphs':ps,'blocks':blocks,'images':ims,'sourceUrl':u,'kind':kind,'seoTitle':clean(ss.title.get_text()) if ss.title else title}
pages=[record(u) for u in links if u!=ROOT]
home=record(ROOT)
site={'home':home,'pages':pages,'contact':{'phone':'(303) 225-4448','email':'hello@rivingtonmarx.com','address':'450 Lincoln St #102, Denver, CO 80203','hours':'By appointment only. Monday–Friday, 9:00 AM–5:00 PM. Saturday & Sunday closed.','sourceUrl':ROOT+'contact/'}}
# Download only media referenced in the finished inventory.
used={i['sourceUrl'] for p in pages+[home] for i in p['images']}
def download(u):
 dest=Path('public/images')/assets[u]
 if dest.exists(): return
 r=subprocess.run(['curl.exe','-fsSL',u],capture_output=True)
 try:
  im=Image.open(io.BytesIO(r.stdout)); im.thumbnail((1600,1600)); im.convert('RGB').save(dest,'WEBP',quality=84)
 except Exception as e: print('ASSET FAILED',u,str(e))
list(concurrent.futures.ThreadPoolExecutor(8).map(download,used))
Path('src/content/site.json').write_text(json.dumps(site,ensure_ascii=False,indent=2),encoding='utf8')
lines=['# Source content inventory','', 'Audited 2026-11-04. All copy and photography originate from the client website. Source HTML is archived in `src/content/raw/`. Content is a local Phase 1 snapshot, not connected to WordPress.','', '| Route | Type | Source | Images |','|---|---|---|---|']
for p in [home]+pages: lines.append('| /'+p['slug']+' | '+p['kind']+' | '+p['sourceUrl']+' | '+str(len(p['images']))+' |')
lines+=['','## Coverage and gaps','','Navigation, page sitemap, post sitemap and portfolio sitemap were audited. Taxonomy archives are not reproduced; articles and projects are individually available. SEO title and description are captured in JSON. Images use original client alt text or source captions and retain origin URLs. WebP copies are resized to a maximum 1600 pixels. Project photographer credits remain in source copy. No content claims have been invented.','','The preview contact form requires a separate mail provider integration and must be marked as a demo. Original privacy text describes the existing website and requires review before launch. Source testimonial encoding contains replacement characters; these are normalized to apostrophes. The original source remains available for comparison.']
Path('docs/content-inventory.md').write_text('\n'.join(lines),encoding='utf8')
print('DONE',len(pages),'pages',len(used),'images')
