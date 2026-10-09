import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync('research/asset-manifest.json','utf8'));
const files=['research/reference.html','research/webflow.css','research/main-original.js',...fs.readdirSync('research/pages').map(f=>'research/pages/'+f)];
for(const file of files){const text=fs.readFileSync(file,'utf8');for(const match of text.matchAll(/https:\/\/(?:cdn\.prod\.website-files\.com|assets\.sondaven\.com)\/[^"'\s<>\\]+?\.(?:avif|webp|jpg|jpeg|png|svg|mp4|MP4|mp3|woff2?|ttf|otf|pdf)(?:\?[^"'\s<>]*)?/g)){const url=match[0];if(manifest.some(a=>a.url===url))continue;const u=new URL(url);manifest.push({url,path:decodeURIComponent(`assets/${u.hostname==='assets.sondaven.com'?u.pathname.slice(1):u.pathname.split('/').slice(2).join('/')}`)});}}
fs.writeFileSync('research/asset-manifest.json',JSON.stringify(manifest,null,2));
const mappings=manifest.map(a=>[a.url,'/'+a.path.split('/').map(encodeURIComponent).join('/')]).sort((a,b)=>b[0].length-a[0].length);fs.writeFileSync('src/data-assets.json',JSON.stringify(Object.fromEntries(mappings),null,2));
for(const dir of ['src/components/templates','src/pages/templates'])for(const file of fs.readdirSync(dir)){if(!file.endsWith('.html'))continue;let text=fs.readFileSync(dir+'/'+file,'utf8');for(const [u,p]of mappings)text=text.replaceAll(u,p);fs.writeFileSync(dir+'/'+file,text);}
console.log('Asset inventory',manifest.length);
