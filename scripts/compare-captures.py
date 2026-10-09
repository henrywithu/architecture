import json,pathlib
from PIL import Image,ImageChops,ImageStat
folder=pathlib.Path('research/screenshots');results=[]
for ref in sorted(folder.glob('ref-*.png')):
 local=folder/ref.name.replace('ref-','local-',1)
 if not local.exists():continue
 a=Image.open(ref).convert('RGB');b=Image.open(local).convert('RGB')
 if a.size!=b.size:continue
 diff=ImageChops.difference(a,b);means=ImageStat.Stat(diff).mean
 pixels=list(diff.getdata());changed=sum(max(p)>12 for p in pixels)
 results.append({'capture':ref.name,'mean_absolute_channel_difference':sum(means)/3,'fraction_pixels_difference_over_12':changed/len(pixels),'size':a.size})
pathlib.Path('research/visual-comparison.json').write_text(json.dumps(results,indent=2))
for r in results:print(r['capture'],round(r['mean_absolute_channel_difference'],3),round(r['fraction_pixels_difference_over_12']*100,2),'%')
for kind in ['desktop','mobile']:
 ref=json.loads(pathlib.Path(f'research/section-metrics-{kind}.json').read_text());local=json.loads(pathlib.Path(f'research/local-section-metrics-{kind}.json').read_text());
 print(kind,'section height deltas:',[(a['index'],a.get('id'),b['height']-a['height'])for a,b in zip(ref,local)if a['height']!=b['height']])
