import json
from pathlib import Path
root='https://rivingtonmarx.com/'
d={
 'hero':{'eyebrow':'Rivington Marx Interiors','title':'Luxury interior design.','accent':'Intentionally yours.','location':['Denver based.','Projects nationwide.'],'ctaLabel':'Explore our portfolio','ctaHref':'/portfolio/','scrollLabel':'Explore the studio','sourceUrl':root,'editorialNote':'Intentionally yours is proposed editorial copy, informed by the source emphasis on bespoke, personal design; it is not a source quotation.'},
 'introduction':{'eyebrow':'Design done differently','title':'We believe a home should do more than impress.','accent':'It should reveal something true.','ctaLabel':'Meet the studio','ctaHref':'/about/','sourceUrl':root},
 'work':{'eyebrow':'A selection of our work','title':'Distinctly personal.','accent':'Thoughtfully composed.','ctaLabel':'All projects','ctaHref':'/portfolio/','sourceUrl':root+'projects/','editorialNote':'Proposed editorial headings for the curated project collection.'},
 'services':{'eyebrow':'From vision to detail','title':'The art of','accent':'living well.','description':'Interior architecture and design, considered as a whole.','ctaLabel':'Discover our approach','ctaHref':'/services/','sourceUrl':root+'services/','editorialNote':'Proposed editorial headings summarizing the source integrated interior design, architectural planning and construction services.'},
 'philosophy':{'eyebrow':'Our point of view','title':'Considered. Enduring.','accent':'Quietly confident.','description':'We do not impose a signature style or recycle concepts. Instead, we translate personal narratives, architecture, and long-term use into spaces that feel considered, enduring, and quietly confident.','ctaLabel':'Inside Rivington Marx','ctaHref':'/about/','sourceUrl':root}
}
Path('src/content/home-design.json').write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
p=Path('src/content/site.json'); site=json.loads(p.read_text(encoding='utf8'))
about=next(x for x in site['pages'] if x['slug']=='about')
# Remove the alternate responsive intro wording, preserving one complete intro and all biographies.
about['paragraphs']=[t for t in about['paragraphs'] if not t.startswith(('Founded in Denver, Rivington Marx is','Unlike some other interior designers, Rivington Marx Interiors looks beyond what is trending'))]
for page in [site['home']]+site['pages']:
 for key in ['paragraphs']:
  page[key]=[t.replace('T he transformative','The transformative').replace('firm .','firm.').replace('magazine .','magazine.') for t in page[key]]
 # Only keep deduplicated blocks represented in the final content; repeated responsive/carousel copies are removed.
 cleaned=[]; seen=set()
 for b in page.get('blocks',[]):
  b['text']=b['text'].replace('T he transformative','The transformative').replace('firm .','firm.').replace('magazine .','magazine.')
  if b['text'] in page['paragraphs'] and b['text'] not in seen:
   cleaned.append(b); seen.add(b['text'])
 page['blocks']=cleaned
p.write_text(json.dumps(site,ensure_ascii=False,indent=2),encoding='utf8')
