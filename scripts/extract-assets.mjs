import fs from 'node:fs';
import {load} from 'cheerio';
const html=fs.readFileSync('research/reference.html','utf8');
const sources=[html,fs.readFileSync('research/webflow.css','utf8'),fs.readFileSync('research/main-original.js','utf8')];
const urls=new Set();
for(const source of sources){for(const match of source.matchAll(/https:\/\/(?:cdn\.prod\.website-files\.com|assets\.sondaven\.com)\/[^\s"'<>`)\\]+/g)){const url=match[0].replace(/&amp;/g,'&');if(/\.(avif|webp|jpg|jpeg|png|svg|mp4|MP4|mp3|woff2?|ttf|otf|pdf)(?:\?|$)/.test(url))urls.add(url);}}
for(let i=0;i<120;i++)urls.add(`https://assets.sondaven.com/hero-video-new/${String(i).padStart(3,'0')}.webp`);
const $=load(html);$('script[type="text/x-wf-template"]').each((_,e)=>{const decoded=decodeURIComponent($(e).text());for(const m of decoded.matchAll(/https:\/\/[^\s"<>]+/g))if(m[0].includes('website-files'))urls.add(m[0]);});
const manifest=[...urls].sort().map(url=>{const u=new URL(url);return {url,path:`assets/${u.hostname==='assets.sondaven.com'?u.pathname.slice(1):u.pathname.split('/').slice(2).join('/')}`};});
fs.writeFileSync('research/asset-manifest.json',JSON.stringify(manifest,null,2));console.log(manifest.length,'assets');
