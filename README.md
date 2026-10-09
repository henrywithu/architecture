# Trapnest Architecture

An independent spatial project by Henry, part of [Trapnest](https://henrywithu.com/). Architecture, atmosphere, material, and interactive design, implemented with TypeScript and Vite. Production domain: **architecture.henrywithu.com**.

```sh
npm install
npm run dev
npm run build
npm run preview
```

The home page is at `/`. `/journal` collects spatial essays adapted from Henry’s published work, `/field-notes` links into the wider Trapnest journal, and `/studies/*` holds architectural reference studies. Previous `/en` and `/ua` URLs remain supported as aliases and redirect to their canonical English routes in production.

## Cloudflare Workers deployment

This is a **Workers Static Assets** deployment. It needs no database, runtime secrets, or application server. `wrangler.jsonc` configures the Worker `architecture`, matching the connected Cloudflare Workers Builds project, and the custom domain `architecture.henrywithu.com`. The site is deployed at [architecture.henrywithu.com](https://architecture.henrywithu.com/).

```sh
npm ci
npm run deploy:check       # build and validate without publishing
npm run verify:deployment # verify generated metadata, routes, and brand assets
npm run dev:worker         # preview actual Workers routing at localhost:8787
npm run deploy            # build and publish with your authenticated Cloudflare account
```

For Cloudflare Workers Builds, connect this repository, select the `main` branch, set the build command to `npm run build`, and the deploy command to `npx wrangler deploy`. Use the repository root as the project directory. Authenticate the CLI with your own Cloudflare account for a manual deployment, or configure the token through Cloudflare’s build settings. No credential belongs in this repository. The `henrywithu.com` zone must be active in that account; Wrangler provisions the custom-domain DNS record and certificate. An existing CNAME on the same hostname must be resolved before attaching the custom domain.

The build writes 13 canonical HTML pages with crawlable text, per-route canonical/Open Graph/Twitter metadata, and structured data; `sitemap.xml` and legacy redirects are generated from the route registry. Unknown URLs return the branded 404 page. Static image, font, audio, and video assets are served locally; every file is checked against the 25 MiB Workers asset limit. Headers set content-type protection, referrer handling, and asset caching.

## Identity and content

- `public/brand/og.jpg`: generated 1200 × 630 architectural social card.
- `public/brand/logo.png`: generated architectural emblem; favicon and touch-icon derivatives sit beside it. `public/favicon.ico` supports browsers requesting the standard icon path.
- `src/styles/brand.css`: restrained wordmark, typography, and brand layout refinements.
- `src/content/journal.json`: source URLs, descriptions, featured-image paths, and original article dates for House, Design, Floral, and wider field notes.
- `src/core/metadata.ts` and `scripts/build-site.mjs`: browser-navigation metadata and crawlable deployment pages.

The visual experience originated as a source-backed reconstruction of [Son Daven](https://sondaven.com/en). Its motion algorithms, WebGL layers, transitions, hero sequence, ambient audio, and video references remain intact. Architectural images are presented as reference studies. The former property sales claims, prices, contact information, and consultation form have been replaced with Trapnest editorial content and working links into Henry’s site.

## Architecture

- `src/components`: semantic template components extracted from the original DOM, composed by `HomePage` and `TemplateComponent`.
- `src/controllers`: independent audio, forms, dialogs, accordion, slider, and tab controllers.
- `src/motion`: original preloader, transitions, text reveals, scroll choreography, magnetic hover, and pointer tips.
- `src/scenes`: original scene layers and their exact placement, levels, grid resolutions, and motion timelines.
- `src/rendering/HalftoneRenderer.ts`: typed WebGL renderer with visibility-aware video playback and owned resources.
- `src/rendering/shaders`: extracted vertex/fragment GLSL, editable independently through Vite HMR.
- `src/core`: lifecycle ownership, Lenis integration, scene manager, and local client router.
- `src/styles`: original layout and responsive rules, with custom component/motion CSS separated into named files.
- `public/assets`: local original images, fonts, videos, ambient audio, PDFs, and 120 hero frames.
- `research`: original source evidence, asset provenance and hashes, route inventory, viewport measurements, and verification results.

The production Webflow bundle, jQuery, Barba, Slater loader, analytics, and cookie-consent code are **not executed**. Source-derived motion controllers preserve the original data-attribute protocol and algorithms, using explicit dynamic adapter types at that boundary. Newly authored application, lifecycle, routing, and rendering code is strictly checked TypeScript. `research/main-original.js` is inspection evidence only.

## Verification and reference evidence

See [research/REVERSE-ENGINEERING.md](research/REVERSE-ENGINEERING.md) for extraction details and behavior mapping. Inspection scripts use Playwright with a system Chromium at `/usr/bin/chromium`. Screenshots are intentionally excluded from Git; they can be regenerated. The original CSS/markup and every asset retain provenance in the manifest.

The destination dialog links to Trapnest, Henry’s author page, and the architecture journal. Room-study video links retain the reference’s Vimeo IDs, including its three empty IDs; visual and audio assets remain local originals. Archived construction films are retained within the architectural reference studies.

```sh
npm run verify:assets
npm run verify:interactions # requires the dev server and Chromium
npm run verify:hmr          # edits/restores one shader to exercise actual HMR
```

Reference/source-import scripts under `scripts/extract-*` are the one-time extraction tools used to create the reconstruction. The maintained TypeScript modules include subsequent typing, lifecycle, and compatibility work; regenerating them from the importer would overwrite those adaptations. Normal development uses Vite directly.
