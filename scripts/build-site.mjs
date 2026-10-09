import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const origin = 'https://architecture.henrywithu.com';
const routes = JSON.parse(fs.readFileSync('src/pages/routes.json', 'utf8'));
const journal = JSON.parse(fs.readFileSync('src/content/journal.json', 'utf8'));
const base = fs.readFileSync('dist/index.html', 'utf8');
const defaultDescription = 'A spatial project by Henry. Explore architecture, atmosphere, material, and interactive design in the Trapnest universe.';
const canonicalRoutes = Object.entries(routes).filter(([route, data]) => route === data.canonical);
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

for (const [route, data] of canonicalRoutes) {
  const $ = load(base);
  const post = journal.posts.find(p => route === `/journal/${p.slug}`);
  const description = post?.description || defaultDescription;
  const url = origin + route;
  $('title').text(data.title);
  $('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content', description);
  $('meta[property="og:title"],meta[name="twitter:title"]').attr('content', data.title);
  $('meta[property="og:url"]').attr('content', url);
  $('link[rel="canonical"]').attr('href', url);
  $('meta[property="og:type"]').attr('content', post ? 'article' : 'website');
  $('html').attr('data-wf-page', data.pageId);
  const website = {
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'Trapnest Architecture', url: origin + '/',
    description: defaultDescription,
    isPartOf: { '@type': 'WebSite', name: 'Trapnest', url: 'https://henrywithu.com/' },
    creator: { '@type': 'Person', name: 'Henry', url: 'https://henrywithu.com/about/' },
  };
  const schema = post ? {
    '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description,
    mainEntityOfPage: url, image: origin + post.image,
    author: website.creator, publisher: { '@type': 'Organization', name: 'Trapnest', url: 'https://henrywithu.com/' },
    isBasedOn: `https://henrywithu.com/${post.source}/`,
  } : website;
  $('#site-schema').text(JSON.stringify(schema).replace(/</g, '\\u003c'));

  // Crawlable text and a useful no-JavaScript edition. The app replaces this on startup.
  let content = '';
  if (post) {
    content = `<img src="${post.image}" alt="${escape(post.title)}"><p>${escape(post.lead)}</p>${post.body.map(([heading, text]) => `<h2>${escape(heading)}</h2><p>${escape(text)}</p>`).join('')}<p><a href="https://henrywithu.com/${post.source}/">Read the complete essay</a> · <a href="${post.live}">Enter the live experience</a></p>`;
  } else if (route === '/field-notes') {
    content = journal.notes.map(([title, date, source, text]) => `<article><p>${date}</p><h2><a href="https://henrywithu.com/${source}/">${escape(title)}</a></h2><p>${escape(text)}</p></article>`).join('');
  } else if (route.startsWith('/studies/')) {
    const template = load(fs.readFileSync(`src/pages/templates/${data.name}.html`, 'utf8'));
    const article = template('.article-text');
    article.find('figure,iframe,script').remove();
    content = article.html() || '';
  } else {
    content = `<img src="/brand/og.jpg" alt="A stone pavilion nested in a quiet forest"><h2>Spaces that stay with you</h2><p>Trapnest Architecture is a spatial chapter of Henry’s journal of Life, Art, Science, and Technology. Explore architecture through atmosphere, material, light, and interactive design.</p>${journal.posts.map(p => `<article><h2><a href="/journal/${p.slug}">${escape(p.title)}</a></h2><p>${escape(p.description)}</p></article>`).join('')}`;
  }
  $('#app').html(`<main class="static-summary"><header><a href="/">Trapnest Architecture</a><nav><a href="/journal">Journal</a><a href="/field-notes">Field notes</a><a href="https://henrywithu.com/">Trapnest</a></nav></header><h1>${escape(data.title.replace(' — Trapnest Architecture', ''))}</h1><p>${escape(description)}</p>${content}<footer>A spatial project by <a href="https://henrywithu.com/about/">Henry</a> · Part of <a href="https://henrywithu.com/">Trapnest</a></footer></main>`);
  $('head').append('<style>.static-summary{display:none}</style>');
  $('head').append('<noscript><style>body{background:#28251f;color:#e6e1d4;font:16px/1.7 Arial,sans-serif}.static-summary{display:block;max-width:960px;margin:auto;padding:40px 24px}.static-summary header,.static-summary nav{display:flex;flex-wrap:wrap;gap:24px;justify-content:space-between}.static-summary h1,.static-summary h2{font-family:Georgia,serif;font-weight:400;line-height:1.2}.static-summary h1{font-size:clamp(38px,7vw,80px);margin:64px 0 24px}.static-summary h2{font-size:30px;margin-top:40px}.static-summary p{max-width:720px;margin:24px 0}.static-summary img{width:100%;height:auto;margin:32px 0}.static-summary a{color:inherit;text-underline-offset:5px}.static-summary footer{border-top:1px solid #615b50;margin-top:64px;padding-top:24px;font-size:13px}</style></noscript>');
  const file = route === '/' ? 'dist/index.html' : path.join('dist', route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, $.html());
}

const redirects = Object.entries(routes).filter(([route,data])=>route!==data.canonical).flatMap(([route,data])=>[
  `${route} ${data.canonical} 301`, `${route}/ ${data.canonical} 301`,
]);
fs.writeFileSync('dist/_redirects', redirects.join('\n') + '\n');
fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicalRoutes.map(([route])=>`  <url><loc>${origin}${route}</loc></url>`).join('\n')}\n</urlset>\n`);
const files = fs.readdirSync('dist', { recursive: true }).filter(file => fs.statSync(path.join('dist',file)).isFile());
const oversized = files.filter(file => fs.statSync(path.join('dist',file)).size > 25 * 1024 * 1024);
if (oversized.length || files.length > 20000) throw new Error(`Workers static asset limits exceeded: ${oversized.join(', ')}; ${files.length} files`);
console.log(`Prepared ${canonicalRoutes.length} crawlable pages, ${redirects.length} redirects, and ${files.length} assets for Cloudflare Workers.`);
