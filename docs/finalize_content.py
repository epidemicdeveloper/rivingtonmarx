import json
from pathlib import Path
p=Path('src/content/site.json'); d=json.loads(p.read_text(encoding='utf8'))
names={'denver-interior-design-firm':'Interior Design','kitchen-remodel-and-design':'Kitchen Design','bathroom-remodel-design-service-in-denver':'Bathroom Design','home-remodeling-and-renovation':'Home Remodeling','luxury-design-build-firm':'Design Build','interior-architectural-design':'Architectural Design'}
for page in d['pages']:
 if page['kind']=='service': page['navigationTitle']=names[page['slug'].split('/')[-1]]
p.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
hp=Path('src/content/home-design.json'); h=json.loads(hp.read_text(encoding='utf8'))
h['hero']['image']=next(i for page in [d['home']]+d['pages'] for i in page['images'] if i['src']=='/images/341f80d4ffac.webp')
hp.write_text(json.dumps(h,ensure_ascii=False,indent=2),encoding='utf8')
for page in d['pages']:
 if page['kind']=='project': print(page['slug'], page['paragraphs'][-3:])
