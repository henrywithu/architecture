import pathlib,json,subprocess,concurrent.futures
root=pathlib.Path('research/pages');routes=json.loads(pathlib.Path('research/routes.json').read_text());paths=json.loads(pathlib.Path('research/additional-routes.json').read_text())
def fetch(path):
 p=root/(path.strip('/').replace('/','__')+'.html');subprocess.run(['curl','-L','--fail','--silent','--show-error','--max-time','60','https://sondaven.com'+path,'-o',str(p)],check=True);return {'path':path,'file':str(p)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:routes+=list(pool.map(fetch,paths))
pathlib.Path('research/routes.json').write_text(json.dumps(routes,indent=2));print('Fetched',len(paths),'additional routes')
