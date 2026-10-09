import pathlib,json,subprocess,concurrent.futures,re
root=pathlib.Path('research/pages');root.mkdir(exist_ok=True)
html=pathlib.Path('research/reference.html').read_text()
paths=sorted(set(re.findall(r'href="(/en(?:/[^"?#]*)?)"',html))|{'/ua','/ua/news','/ua/construction-progress'})
def fetch(path):
 name=path.strip('/').replace('/','__')+'.html';p=root/name
 subprocess.run(['curl','-L','--fail','--silent','--show-error','--max-time','60','https://sondaven.com'+path,'-o',str(p)],check=True)
 return {'path':path,'file':str(p)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:items=list(pool.map(fetch,paths))
pathlib.Path('research/routes.json').write_text(json.dumps(items,indent=2));print('Fetched',len(items),'routes')
