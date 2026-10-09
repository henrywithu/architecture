import assert from 'node:assert/strict';
import fs from 'node:fs';
import { load } from 'cheerio';

const origin = 'https://architecture.henrywithu.com';
const routes = JSON.parse(fs.readFileSync('src/pages/routes.json', 'utf8'));
const canonical = Object.entries(routes).filter(([route,data])=>route===data.canonical);
for (const [route,data] of canonical) {
  const file = route === '/' ? 'dist/index.html' : `dist${route}/index.html`;
  const $ = load(fs.readFileSync(file,'utf8'));
  assert.equal($('title').text(),data.title, file);
  assert.equal($('link[rel="canonical"]').attr('href'),origin+route, file);
  assert.equal($('meta[property="og:url"]').attr('content'),origin+route, file);
  assert.equal($('meta[property="og:image"]').attr('content'),origin+'/brand/og.jpg', file);
  assert($('meta[name="description"]').attr('content')?.length > 40, file);
  assert($('#app h1').text().length > 0, `Missing crawlable content in ${file}`);
  assert(!$('#app').text().match(/Son Daven|blago|annual return|investment project|sale@/i),file);
  JSON.parse($('#site-schema').text());
}
const redirects=fs.readFileSync('dist/_redirects','utf8');
for(const[route,data]of Object.entries(routes))if(route!==data.canonical)assert(redirects.includes(`${route} ${data.canonical} 301`));
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
for(const[route]of canonical)assert(sitemap.includes(`<loc>${origin}${route}</loc>`));
for(const asset of ['/brand/og.jpg','/brand/logo.png','/brand/icon-32.png','/brand/icon-180.png','/favicon.ico','/robots.txt','/site.webmanifest','/404.html'])assert(fs.existsSync('dist'+asset),asset);
console.log(`Verified ${canonical.length} pages: crawlable text, canonical and social metadata, schema, sitemap, redirects, and brand assets.`);
