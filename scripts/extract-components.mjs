import fs from 'node:fs';import {load} from 'cheerio';import path from 'node:path';
const manifest=JSON.parse(fs.readFileSync('research/asset-manifest.json','utf8'));
for(const item of manifest){const decoded=decodeURIComponent(item.path);if(decoded!==item.path&&fs.existsSync('public/'+item.path)){fs.renameSync('public/'+item.path,'public/'+decoded);}item.path=decoded;}
fs.writeFileSync('research/asset-manifest.json',JSON.stringify(manifest,null,2));
const mapping=new Map(manifest.map(a=>[a.url,'/'+a.path.split('/').map(encodeURIComponent).join('/')]));
function localize(text){for(const [url,p] of [...mapping].sort((a,b)=>b[0].length-a[0].length))text=text.replaceAll(url,p);return text;}
fs.mkdirSync('src/styles',{recursive:true});fs.writeFileSync('src/styles/reference-layout.css',localize(fs.readFileSync('research/webflow.css','utf8')));
const styleNames={3:'reset',4:'preloader',5:'inputs',6:'selection',9:'tokens',10:'controls',11:'effects',12:'motion',13:'apartment-tabs'};
for(const [id,name] of Object.entries(styleNames))fs.writeFileSync(`src/styles/${name}.css`,localize(fs.readFileSync(`research/inline-${id}.css`,'utf8')));
const $=load(fs.readFileSync('research/reference.html','utf8'));
$('script,style,noscript,[fs-cc="banner"],.main-css').remove();
$('[data-wf-page-id],[data-wf-element-id]').each((_,e)=>{delete e.attribs['data-wf-page-id'];delete e.attribs['data-wf-element-id'];});
const names=['header','hero','prologue','about-transition','about','location','benefits-transition','benefits','construction','apartments','finance','seasons','developer','factoids','gallery','blog','consultation','faq','footer','cursor','consultation-dialog','film-dialog','menu-dialog','apartment-video-dialogs','sound'];
fs.mkdirSync('src/components/templates',{recursive:true});
const components=[];$('.transition-container').children().each((i,e)=>{const name=names[i];if(!name)throw Error('Unknown component '+i);const markup=localize($.html(e));fs.writeFileSync(`src/components/templates/${name}.html`,markup);components.push(name);});
const shells=['master-preloader','noise','preloader','transition','landscape-cover'];
for(const name of shells)fs.writeFileSync(`src/components/templates/${name}.html`,localize($.html($('.'+name))));
fs.writeFileSync('src/components/component-list.json',JSON.stringify(components,null,2));
fs.writeFileSync('src/data-assets.json',JSON.stringify(Object.fromEntries(mapping),null,2));
fs.writeFileSync('src/components/templates/head.html',$('head').html());
console.log('Extracted',components.length,'components and',Object.keys(styleNames).length+1,'stylesheets');
