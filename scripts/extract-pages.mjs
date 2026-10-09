import fs from 'node:fs';import {load} from 'cheerio';
const routes=JSON.parse(fs.readFileSync('research/routes.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('research/asset-manifest.json','utf8'));const urls=new Set(manifest.map(i=>i.url));
for(const route of routes){const html=fs.readFileSync(route.file,'utf8');for(const m of html.matchAll(/https:\/\/(?:cdn\.prod\.website-files\.com|assets\.sondaven\.com)\/[^\s"'<>`)\\]+/g))if(/\.(avif|webp|jpg|jpeg|png|svg|mp4|MP4|mp3|woff2?|ttf|otf|pdf)(?:\?|$)/.test(m[0]))urls.add(m[0]);}
for(const url of urls){if(!manifest.find(a=>a.url===url)){const u=new URL(url);manifest.push({url,path:decodeURIComponent(`assets/${u.hostname==='assets.sondaven.com'?u.pathname.slice(1):u.pathname.split('/').slice(2).join('/')}`)});}}
fs.writeFileSync('research/asset-manifest.json',JSON.stringify(manifest,null,2));
const mapping=manifest.map(a=>[a.url,'/'+a.path.split('/').map(encodeURIComponent).join('/')]).sort((a,b)=>b[0].length-a[0].length);
function localize(text){for(const [u,p]of mapping)text=text.replaceAll(u,p);return text;}
fs.writeFileSync('src/data-assets.json',JSON.stringify(Object.fromEntries(mapping),null,2));
fs.mkdirSync('src/pages/templates',{recursive:true});const index={};
for(const route of routes){const $=load(fs.readFileSync(route.file,'utf8'));$('script,style,noscript,[fs-cc="banner"],.main-css').remove();const page=$('[data-barba="container"]');if(!page.length)continue;const name=route.path.slice(1).replaceAll('/','__');fs.writeFileSync(`src/pages/templates/${name}.html`,localize($.html(page)));index[route.path]={name,title:$('title').text(),pageId:$('html').attr('data-wf-page')};}
fs.writeFileSync('src/pages/routes.json',JSON.stringify(index,null,2));console.log('Pages',Object.keys(index).length,'assets',manifest.length);
