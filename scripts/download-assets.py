import json,urllib.request,concurrent.futures,pathlib,hashlib,subprocess
manifest=json.loads(pathlib.Path('research/asset-manifest.json').read_text())
def download(item):
 p=pathlib.Path('public')/item['path'];p.parent.mkdir(parents=True,exist_ok=True)
 try:
  if not p.exists():
   subprocess.run(['curl','-L','--fail','--silent','--show-error','--retry','2','--max-time','120',item['url'],'-o',str(p)],check=True,capture_output=True)
  item.pop('error',None);item['bytes']=p.stat().st_size;item['sha256']=hashlib.sha256(p.read_bytes()).hexdigest()
  return item
 except Exception as e:item['error']=str(e);return item
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:results=list(pool.map(download,manifest))
pathlib.Path('research/asset-manifest.json').write_text(json.dumps(results,indent=2))
print('Downloaded',sum('bytes' in i for i in results),'of',len(results),'bytes',sum(i.get('bytes',0) for i in results))
print('Errors',[(i['path'],i['error']) for i in results if 'error' in i]);print('Large',[(i['path'],i['bytes']) for i in results if i.get('bytes',0)>20_000_000])
