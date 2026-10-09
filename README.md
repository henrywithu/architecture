# Architecture

Source-backed reconstruction of [Son Daven](https://sondaven.com/en), implemented with TypeScript and Vite. No deployment is configured.

```sh
npm install
npm run dev
npm run build
npm run preview
```

The English home page is at `/en` (also `/`). Ukrainian home, news listings, construction updates, and the English articles linked from the home page are local routes.

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

The consultation form validates and saves a preview request in session storage. It is not connected to the original business's form service. Apartment video links retain the reference's Vimeo IDs, including its three empty IDs; the other visual and audio assets are local originals.

```sh
npm run verify:assets
npm run verify:interactions # requires the dev server and Chromium
npm run verify:hmr          # edits/restores one shader to exercise actual HMR
```

Reference/source-import scripts under `scripts/extract-*` are the one-time extraction tools used to create the reconstruction. The maintained TypeScript modules include subsequent typing, lifecycle, and compatibility work; regenerating them from the importer would overwrite those adaptations. Normal development uses Vite directly.
