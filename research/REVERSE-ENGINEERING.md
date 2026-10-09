# Son Daven reference reconstruction

Reference: https://sondaven.com/en. Captured 2026-10-09. Project: Architecture.

## Evidence and extraction chain

The source HTML is `reference.html` (390,582 bytes). Its stylesheet is `webflow.css`. Inline styles and scripts were extracted separately; `structure.txt` records element classes and data attributes. `rendered.html` records the live DOM after initialization. `network.json` records browser URLs, resource types, and status codes. `errors.json` contains the reference's observed JavaScript errors (none on initial capture).

The original loader imports `https://assets.slater.app/slater/18883/55210.js?v=278981`. Its fetched and formatted source is `main-original.js`. This source provides the custom behavior; it is not imported or evaluated by the application. The independent `ActiveFrame.js` library is retained as evidence but is not used by the currently active reference module: its current hero implementation preloads WebP frames rather than decoding a binary frame manifest.

The reference loads Webflow, jQuery, Barba, GSAP 3.13/3.14, CustomEase, SplitText, Flip, Lenis 1.3.15, Swiper 11, and Finsweet cookie consent. The reconstruction pins npm GSAP/SplitText 3.13.0 and Flip 3.14.1 independently, matching the reference; it uses Lenis 1.3.15 and Swiper 11 directly. Webflow's generated DOM/CSS are preserved as design source, while a local TypeScript router replaces Barba and browser-native form validation replaces Webflow submission. Analytics and consent scripts are excluded.

`asset-manifest.json` records each original URL, local path, byte count, and SHA-256. The extraction includes responsive `srcset` variants and CSS images/fonts, not just visibly loaded images. Original percent-encoded filenames are decoded on disk and encoded in local URLs. All recorded assets downloaded successfully. The original assets are served from `/assets/` and do not depend on the reference CDN at runtime.

## Page topology and content

25 home components were extracted without changing the copy or embedded SVGs. Their order is header, hero, prologue, about transition, about, location, benefits transition, benefits, construction, apartments, finance, seasons, developer, factoids, gallery, blog, consultation, FAQ, footer, cursor tips, consultation dialog, film dialog, menu dialog, apartment video dialogs, and sound control. Shared loading/transition/noise/landscape layers sit outside the route container.

The English home has 17 `<section>` elements. Desktop at 1440×900 starts with a 3600px hero scroll area and a 900px prologue. Mobile at 390×844 uses a 1266px hero and 516px prologue. The exact measurements for every section are stored in `section-metrics-desktop.json` and `section-metrics-mobile.json`; local measurements are stored in matching `local-*` files. Heights change after animations, expansion, or font reflow, so comparisons must be made at the same state.

Original English text, including existing Ukrainian news titles and source inconsistencies in dates/financial claims, is preserved. No invented investment figures or rewritten marketing copy is substituted. The original apartment type data, layouts, photo sequences, FAQ answers, contact addresses, map links, and legal PDFs are preserved.

All 26 English and Ukrainian home, news, and construction listing/detail routes reachable from the extracted pages are included. Routes are indexed in `routes.json` and `src/pages/routes.json`. Page HTML is loaded in separate Vite chunks. Navigation applies the original transition, swaps the page component, destroys old listeners/scenes/scroll triggers, and initializes the new route. Browser back restores stored scroll position.

## Layout, typography, and responsiveness

The layout is based on Webflow's original class rules, custom properties, grid placement, and unit system. Desktop's root font size is `1vw`. Original breakpoints are 991px, 767px, and 479px; JavaScript's desktop behavior threshold is 992px. The original portrait/coarse-pointer landscape cover is preserved.

KTF Metro Roman and KTF Metro Blueline are the two downloaded custom OpenType faces. Serif display text uses the original system serif stack. Brand marks and ornamentation are original inline SVGs rather than replacement text or drawings. Original colors, noise AVIF, border geometry, masks, blend modes, uppercase transformations, clipping, and sticky placement remain in extracted stylesheets.

Custom CSS is split into reset, loading visibility, input treatment, selection, timing tokens, hover controls, effects, motion initial states, and apartment-tab rules. The generated layout stylesheet is preserved to prevent rounding/grid differences from a manual approximation.

## Timing and scroll choreography

| Behavior | Source implementation preserved |
| --- | --- |
| Timing constants | JS: short 0.4s, medium 0.8s, long 1.2s, stagger 0.1s, reveal delay 0.2s. CSS medium duration independently remains 0.6s. |
| Eases | InOut `(0.76,0,0.24,1)`; Out `(0.25,1,0.5,1)`; In `(0.5,0,0.75,0)`; Ease `(0.25,0.1,0.25,1)`; Write `(0.333,0,0.667,1)`. |
| Lenis | Duration 1.2s, smooth wheel, touch multiplier 2, exponential `min(1,1.001−2^(−10t))`; nested containers use 0.6s. GSAP ticker drives Lenis. |
| First-visit loader | Sheep video, animated text/ornaments, scene/frame/font readiness, percentage progress, masked transition, logo Flip into hero, video scale 1.5→1 over 2.4s. |
| Returning loader | Session flag bypasses the long intro; still waits for scenes, hero frames, and fonts before exposing content. |
| Hero sequence | 120 original `/hero-video-new/000.webp`…`119.webp` images. Canvas draws each frame with cover fitting, scrubbing 0.25 from `top top` to `75% bottom`. |
| Hero text/exit | Title moves up 100%, scales to 0.5 and fades over first half; hero shrinks to 0.3 over `70% bottom`→`bottom bottom`, with scrub 1. |
| Header | Background appears past 1000px. Downward movement of at least 40px hides it; upward scrolling reveals it; within 160px of bottom it is shown. |
| Parallax | Images −20→20%; outgoing images −10→30%; containers ±10%; large headings alternate horizontal movement. Original trigger boundaries retained. |
| Text reveal | SplitText words emerge from alternating Y offsets and scale 0 with randomized stagger. Paragraph lines move from 250% Y. Text highlight splits characters and increases opacity with scroll. |
| Benefits | Horizontal card traversal on desktop; original randomized x/y/rotation drift and staggered grid locations. Mobile uses original stacked layout. Intro title scales from zero, then title and scene fade into outro. |
| Footer | Desktop foreground scale 2→1 and backdrop scale 0.75→1 while scrolling the footer. |

## Controls, pointer effects, and media

| Control | Behavior |
| --- | --- |
| Main menu | Mask sweeps from 200% to 0% with mask size `100% 400%`; menu labels and desktop/mobile hamburger lines animate; header switches theme; scrolling locks. |
| Consultation | Perspective card scales/rotates from `scale:0, rotateX:-90, y:-100%, rotate:-25°`; close rotates out by +90° and moves down 200%. Backdrop fades. Form labels float on focus. |
| Form validation | Original numeric/punctuation filtering for name and non-phone characters; native required input validation; locally stored preview request and original form-to-success flip. No requests to the source business. |
| Film modal | Original full MP4, volume 0.25, scale 2→1, masked entry over 1.8s, close fades/scales and releases media. |
| Apartment videos | Original Vimeo IDs retained. Three reference IDs are empty, so those remain unavailable rather than invented. |
| Apartment tabs | Outgoing panel rotates +15° and slides −125%; incoming starts −15°/+125%, settles over 1.2s. Highlight moves/resizes to active tab. |
| Image sliders | Circular indices, looping previous/next, inset clip reveal from the relevant edge, image scale 1.5→1. |
| Location text slider | 6-second visible-only autoplay, radial progress, animated text/circle swaps; previous/next wrap. |
| News dragging | Original Swiper free mode, momentum, 800ms navigation, auto slide width, horizontal mousewheel. |
| Seasons | Summer/winter text and source-video scene cross-switch. Draggable knob follows the exact SVG path via closest-point sampling (101 points), snapping to an endpoint. |
| FAQ | One open item, height animation 0↔auto, rotating plus glyph, paragraph reveal, ScrollTrigger refresh after resizing. |
| Map pins | Original matched pin/control attributes and hover labels. |
| Magnetic buttons | Desktop pointer displacement uses normalized element-relative coordinates ×strength/16 in em; power4 movement over 1.6/2s, elastic return `elastic.out(1,0.3)`. |
| Text/link hover | SplitText characters translate/scale with randomized stagger; original duplicated-label and divider effects retained. |
| Pointer tips | Original context-aware floating drag/view/play hints; original cursor offsets and visibility handling retained. |
| Button surfaces | Original shrinking/expanding backgrounds, border-radius changes, inverse icon colors, and line fills remain in CSS. |
| Sound | Original `carpathian-whispers-hutsul-ambient.mp3`, looped, user-enabled, fade to volume 0.25; original animated equalizer bars synchronized across toggles. |
| Section videos | Play/pause when intersecting; muted autoplay and inline video attributes preserved. |
| External destinations | Original telephone, email, maps, social links and PDFs retained. |

## WebGL shader and scene reconstruction

The rendering system is WebGL 1 and GLSL, not WebGPU/WGSL. `halftone.vertex.glsl` passes UVs through a full-screen quad. `halftone.fragment.glsl` preserves the exact original fragment math, including the generated 5×5 neighboring-texel stencil. The shader uses rectangular layer bounds and an independent cell grid for each layer.

For each fragment it computes a local cell index/center, samples the cell's texture color, rejects transparent or near-black texels and any neighboring black/transparent texel, applies gamma and black/white levels, computes brightness `dot(rgb,vec3(0.333))*alpha`, and converts inverse brightness into a vertical line width. Width is interpolated between layer-specific minimum/maximum widths and normalized by layer bounds/grid columns. Threshold selects background versus line fill. Root theme colors provide both colors; independent layer alpha values control compositing. This is the source of the animated striped mountains, sheep, birds, people, trees, clouds, and river.

The renderer retains DPR cap 1.5, non-antialiased context, straight-alpha blending, flipped texture upload, linear texture filtering, clamp-to-edge wrapping, video updates only when video time changes, nominal 60fps, and viewport-driven playback/rendering. Images/video layers keep the original configuration objects so GSAP can mutate levels, positions and opacity in place. Renderer resources and observers are destroyed on route/HMR changes; failed/unsupported video layers do not block page loading indefinitely (original 5-second readiness limit).

| Scene module | Extracted layers/effects |
| --- | --- |
| Hero foreground | Original mountain + hay AVIF, tree, sheep, clouds, flying birds; exact percentage/vw placement, levels, mobile exclusions, moving clouds, scroll-level adjustments. |
| Hero background | Mountain AVIF, clouds, crossing birds; desktop-only, independent motion. |
| Prologue | Original left and right animated scenery videos; reused in menu. |
| About | Birds and stork, animated crossings. |
| Benefits intro | Hole AVIF, people, birds, viewport-specific placement. |
| Benefits outro | Sheep, birds, tree, scrolling levels and animated movement. |
| Finance | Mountain AVIF with the original levels and placement. |
| Seasons | Original summer and winter MP4s, switchable fill/background opacity. |
| Developer | Foreground cloud and background clouds/birds, exact scene timelines. |
| Factoids | River, sheep, person; original grid widths and color levels. |
| FAQ | Crossing birds over the original typography. |
| Footer | Original animated mountain and sheep sources. |
| Articles/error | Original bird scenes and error mountain/hay/sheep composition for source-backed routes. |

## Validation and intentional differences

Reference screenshots include all 17 sections at 1440×900 and 390×844, plus menu and consultation overlays. Scripts are `capture-reference.mjs` and `capture-implementation.mjs`. Desktop rendering is paused only during screenshots to avoid continuous software-WebGL rasterization delaying capture; timing-sensitive states and moving videos cannot be expected to yield a byte-identical screenshot at arbitrary capture times. Randomized source animation staggering is retained.

The consultation service is local-only, consent is omitted per request, tracking is omitted, and navigation is served locally. These are deliberate functional differences. Empty source Vimeo IDs and original textual inconsistencies are recorded rather than silently replaced. A newer SplitText version was tested during migration but changed nested splitting and collapsed two text sections. Pinning the original 3.13.0 resolved the discrepancy. No claim of a measured 100% match is made; source extraction minimizes approximations, while layout/interaction comparisons provide concrete verification evidence.

## Measured comparison results

The final original-version comparison gives exact section heights at 1440×900. At 390×844, all heights match except the location section's 1px rounding difference. Measurements describe the initial collapsed state.

Using a per-pixel maximum RGB-channel difference threshold of 12/255, matching pixels are 99.950% for the desktop hero, 99.930% for the mobile hero, 99.976% for the consultation overlay, 99.989% for the desktop apartment introduction, and 99.988% for the captured gallery/blog starts. These are capture-specific results, not a whole-site percentage. Animated scene positions, randomized reveals/card rotation, equalizer bars, and capture timing account for larger differences in other states. Full numeric results are in `visual-comparison.json`.

`asset-verification.json` verifies all 459 local assets against their recorded SHA-256 hashes, totaling 227,693,748 bytes, and checks all extracted template asset paths. The source Webflow runtime is archived as `webflow-original.js`; the home has no `data-w-id` interactions and no native Webflow slider/tab/nav/dropdown widgets to reproduce beyond the extracted custom controllers.

Final browser checks pass for the initial loader, cookie omission, menu, consultation/input filtering, audio, apartment tabs, FAQ, summer/winter, gallery pagination, local news navigation, Ukrainian/English switching, and mobile overflow. `interaction-verification.json` records no JavaScript errors or failed local requests. `hmr-verification.json` confirms an actual shader edit preserves the browser document and leaves one page/header/noise instance with working menu events. `back-navigation-verification.json` confirms exact restoration of the saved 1400px scroll position.
