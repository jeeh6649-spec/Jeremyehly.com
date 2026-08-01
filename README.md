# Jeremy Ehly | Portfolio Website

This is a [Jekyll](https://jekyllrb.com) site built for GitHub Pages. It is the live source for jeremyehly.com (or its GitHub Pages URL until a custom domain is attached).

See `CLAUDE.md` for the full project brief: brand rules, page components, and conventions to follow when extending the site with Claude Code.

See `SEO-GUIDE.md` for the required page metadata, URL, heading, structured-data, and pre-launch search conventions. Run `node validate-seo.mjs` whenever a page is added or its metadata changes.

## Local development

```
bundle install
bin/jekyll serve
```

Then open `http://localhost:4000`. Jekyll watches the filesystem and rebuilds on save.

If this is the first time running it after cloning, and `.git/index.lock` or any other stray file exists in `.git/` from earlier setup, remove it first:

```
rm -f .git/index.lock
```

## Repository structure

+ `_config.yml` | site title, description, baseurl
+ `_layouts/default.html` | the single shared page shell (head, header, main, footer, lightbox markup, script tags)
+ `_includes/header.html`, `_includes/footer.html` | shared nav and footer, included on every page
+ `_includes/seo.html` | canonical search, social-sharing, robots, and structured-data metadata
+ `assets/css/site.css` | canonical stylesheet for the whole site
+ `assets/js/site.js` | canonical script (read-more, lightbox, zoom lens, gallery wiring, hero slideshow), safe to include on every page
+ `assets/js/teaching-index.js` | page-specific script, loaded only on the Teaching index via front matter
+ `assets/icons/`, `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest` | bespoke JE favicon and browser icon set
+ `about/`, `teaching/`, `teaching/courses/*/`, `work/`, `ai-leadership/` | one folder per page, each with an `index.html` carrying Jekyll front matter and body-only markup
+ `_data/student_evaluation_quotes.json` | canonical course-evaluation quotation library for course pages and site-wide student voices
+ `_shared/brand/` | shared image assets (headshot, etc.) referenced across sections
+ `_shared/editorial/voice-style-guide.md` | canonical first-person voice, tone, humor, attribution, and editing guidance for all authored copy
+ `SEO-GUIDE.md`, `validate-seo.mjs` | shared SEO contract and automated page-level checks

## Adding a new page

Every page's `index.html` needs YAML front matter at the top:

```
---
layout: default
title: Page Title
seo_title: Descriptive Search Title
description: "A specific, first-person summary of this page."
social_image: /section/page/media/descriptive-image.webp
social_image_alt: A concise description of the social-sharing image
nav: teaching        # controls which nav link gets the "current" state
needs_lightbox: true # only if the page uses the scroll-gallery/zoom/lightbox pattern
extra_js: /assets/js/some-page-script.js   # only if the page needs its own script
---
```

Everything below the front matter is body content only. No `<!DOCTYPE>`, `<html>`, `<head>`, `<style>`, `<header>`, `<footer>`, or `<script src="site.js">` in the page itself; the layout supplies all of that.

The `bin/jekyll` wrapper runs the standard GitHub Pages toolchain and supplies a local compatibility layer only when the installed Ruby version requires it. Use it for both `serve` and `build` commands.

## Deployment

Push to GitHub and enable Pages (Settings -> Pages -> Deploy from a branch -> main). GitHub builds the `github-pages` gem automatically; no separate build step or GitHub Action is required. See `CLAUDE.md` for the full one-time setup walkthrough.

## Source policy

This repository is a derivative publication layer. Original syllabi, PDFs, full portfolios, student submissions, and full-resolution project archives are not stored here; only web-ready derivatives are.

Do not commit private evidence documents, residential addresses, phone numbers, account screenshots, or raw student submissions to this repository. Student work is credited collectively per project team where the source archive provides a reliable roster; individual student names are not otherwise used without a specific, separate decision to do so.

## Content status

The publication layer includes the homepage, About, AI Leadership, Teaching and its course pages, and eleven published Work project pages. See `work/catalog.json` for canonical project metadata and `work/media-queue.json` for production status.
