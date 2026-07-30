# Project brief for Claude Code

This file is read automatically by Claude Code at the start of a session in this repository. It captures the brand rules, components, and conventions this site was built with, so new work stays consistent without re-deriving everything from scratch.

## What this is

Jeremy Ehly's personal site: design educator and licensed architect at CU Boulder. Jekyll site for GitHub Pages. See `README.md` for local dev and deployment commands.

## Absolute rules

+ No em-dashes anywhere, in any file. Use `|` or `+` or a period instead. This includes the HTML entity `&mdash;`.
+ No italics anywhere. No `font-style: italic`, no `<em>` tags.
+ No phone number, no private source documents, no individual student names (design-build project teams are credited collectively by project, per the source policy in `README.md`). Never add residential addresses or account screenshots.
+ Font stack is Gilroy (ExtraBold 800 / Light 300 pairing) with General Sans as the approved fallback. Weight pairing only, no midweights.
+ All authored website copy is first-person and direct. Follow `_shared/editorial/voice-style-guide.md` for point of view, tone, humor, attribution, and editing standards.
+ Student evaluation quotations must come from `_data/student_evaluation_quotes.json`. Do not paraphrase them or introduce a quotation directly into page JavaScript or HTML without also adding it to the canonical library.

Before considering any HTML file shippable, check it against this pipeline:
1. `grep` for the literal em-dash byte sequence and `&mdash;`
2. `grep` for `font-style:italic` and `<em>`
3. Confirm `<div>`/`</div>` counts match
4. If the file has a `<script>` block, confirm it's syntactically valid
5. Confirm every `src=`/`href=`/`poster=`/`background-image:url()` path resolves to a real file

## Brand system

CSS variables (defined once in `assets/css/site.css`, do not redefine per-page):
`--k` (ink/near-black), `--g` (gray), `--lg` (light gray hairline), `--b` (body text gray), `--bg` (page background), `--white`, `--maxw` (1200px content width).

Hairline rules, `|` pipe separators between metadata items, `+` plus-sign bullet markers (see `.lead-item .plus` in site.css). No boxed/card containers other than the course-grid cards and quote blocks, which are documented components below.

## Shared layout system (Jekyll)

Every page is body-only markup with YAML front matter. The layout (`_layouts/default.html`) supplies `<head>`, `_includes/header.html`, `<main>{{ content }}</main>`, `_includes/footer.html`, and conditionally the lightbox/zoom-lens markup and scripts. Never paste a `<style>`, `<header>`, `<footer>`, or inline `<script>` block into a page file, it belongs in the shared files.

Front matter fields:
+ `layout: default` | always
+ `title` | internal and visible page name
+ `seo_title`, `description`, `social_image`, `social_image_alt` | required search and sharing fields; see `SEO-GUIDE.md`
+ `schema_type` | optional; defaults to `WebPage`, with `ProfilePage` used on About
+ `canonical_path`, `noindex`, `sitemap` | optional technical controls; use only as documented in `SEO-GUIDE.md`
+ `nav` | one of `about`, `teaching`, `work`, `ai-leadership`, controls which header nav link gets `.current`
+ `needs_lightbox: true` | only on pages that use the scroll-gallery / zoom-lens / lightbox pattern
+ `extra_js` | path to a page-specific script, only if the page needs one beyond `site.js`

All internal links to shared assets in `_includes`/`_layouts` use the `relative_url` Liquid filter so the site works whether hosted at a domain root or a GitHub Pages project subpath (`_config.yml` -> `baseurl`). Existing inter-page links inside page bodies (breadcrumbs, course-grid card hrefs, all `media/...` image paths) are plain relative paths and do NOT use `relative_url`, Jekyll preserves the source folder structure for pages with front matter, so these keep working unchanged.

The shared `_includes/seo.html` owns titles, descriptions, canonical URLs, social metadata, robots directives, and structured data. Do not recreate those tags in individual pages. Every published page must contain exactly one semantic `h1`, and internal page links use folder URLs rather than `index.html` URLs.

## Reusable page components

All defined once in `assets/css/site.css`, wired once in `assets/js/site.js` (guarded per-feature on DOM element existence, so the single script file is safe to include on any page regardless of which components it uses).

**Lead Statement** (`.intro-statement` / `.intro-more` / `.read-more-btn`): bold opening statement with an expandable "Read More" block underneath.

**Scroll-gallery** (`.scroll-gallery` / `.scroll-item` / `.scroll-frame` / `.scroll-cap` / `.gallery-hint`): horizontal scroll-snap image row, natural aspect ratio (not cropped), each frame links to the full-res original. This is the standard way to show a project's image set, replacing any cropped grid pattern.

**Cursor-tracking zoom lens** (`#zoomLens`, `moveZoomLens()` in site.js): a `position:fixed` magnifying-glass lens that follows the cursor over any `.scroll-frame`, escaping scroll-container clipping since it's fixed to the viewport. Soft radial-fade edge via `mask-image`, no border. Only wired on pages with `needs_lightbox: true`.

**Lightbox** (`#lightbox`): full-viewport click-through overlay. `+` / `−` buttons (not arrows) flank the image, caption is the frame's `.scroll-cap` text, Escape/ArrowLeft/ArrowRight keyboard support. `currentFrames`/`currentIndex` are scoped per-gallery so prev/next stays within one project's image set.

**Hero slideshow** (`.hero-slideshow` / `.hero-slide` / `.hero-dots`): full-bleed autoplay crossfade-and-blur slider near the top of a course page, each slide links to a `.project-block` below via anchor (`#project-x`, which needs `scroll-margin-top:90px` to clear the sticky header). Used to give a studio page visual presence up front. Not mandatory, only build this if the course has a natural strongest-image-per-project set (arrival/exterior shots, or team photos for design-build).

**Board-link** (`.board-link`, `data-board-target`): anchor that opens the lightbox directly at a project's first final-board-panel image. Only build this for a course whose source files actually have a lettered final-board naming convention (currently Iceland only), never fabricate one.

**Footer tagline** (in `_includes/footer.html`, do not duplicate per-page): bold `Jeremy Ehly`, then `Licensed Architect | Design Educator | Ethical AI in Design Practice | CU Boulder`.

**Studio Framing vs My Approach**: the `.block-eyebrow` label on a course's teaching-philosophy section reads "Studio Framing" for studio courses (Design-Build, Iceland, Museum) and "My Approach" for seminar courses (Generative Design with AI).

## Known gaps / pending work

+ AI Leadership overview page not yet built (`ai-leadership/`)
+ 3 Work project pages not yet built (outside-in, restaurant-projects-denver, brilliant-balconies) (`work/`)
+ Homepage (`index.html` at repo root) not yet wired to real content
+ `_shared/brand/brand-tokens.css` and `brand-assets.json` are leftover scaffolding from an early planning pass using different variable names than what's actually used in `site.css`. Safe to delete once confirmed nothing references them.

## Verification

There's no CI here yet. Before pushing, run `node validate-seo.mjs` and `bin/jekyll build`, skim `_site/` for anything obviously broken, and spot check the absolute rules above across changed files. Use `bin/jekyll serve` for local preview; the wrapper preserves the GitHub Pages stack while handling newer local Ruby versions.
