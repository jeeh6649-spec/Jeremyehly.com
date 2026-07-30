# Jeremy Ehly Website SEO Guide

This file is the implementation contract for any person or AI model adding pages to the site. SEO behavior is centralized in `_includes/seo.html`; page files provide only the fields below.

## Required frontmatter

Every published `index.html` must include:

```yaml
---
layout: default
title: Visible Page Name
seo_title: Descriptive Search Title
description: "A specific, first-person summary of this page."
social_image: /section/page/media/descriptive-image.webp
social_image_alt: A concise description of the social-sharing image
nav: teaching
---
```

- `title` names the page within the content system.
- `seo_title` is the search title without the final `| Jeremy Ehly`; the template adds that suffix automatically.
- `description` should usually be 120 to 165 characters, written directly and specifically. Do not list keywords.
- `social_image` must be a site-root path beginning with `/`. Prefer a clear landscape image at least 1200 pixels wide.
- `social_image_alt` describes what is visibly present, not what the page hopes to rank for.
- `canonical_path` is optional and should be used only when a page intentionally declares another site path as canonical.
- `schema_type` defaults to `WebPage`. Use `ProfilePage` for the About page. Do not invent structured-data types merely to pursue a rich result.
- `noindex: true` keeps a temporary page out of search results and the sitemap. It is not a privacy control.
- `sitemap: false` removes a utility page from the XML sitemap.

## Page rules

1. Every published page has exactly one visible `<h1 class="page-title...">`.
2. Internal links use folder URLs such as `/teaching/`, never `/teaching/index.html`.
3. Important positioning and evidence remain visible in the rendered HTML. Do not place every relevant phrase inside an expandable panel.
4. Image alt text describes the image. Captions can explain its significance.
5. Student comments may appear as visible testimonials, but must not use `Review` or `AggregateRating` structured data.
6. Do not publish phone numbers, residential addresses, private evidence files, or personal student information.
7. Page copy follows `_shared/editorial/voice-style-guide.md`: first-person, direct, specific, and grounded in evidence.

## Shared implementation

`_includes/seo.html` generates:

- Search title and meta description
- Self-referential canonical URL
- Robots directives
- Open Graph metadata
- Twitter/X summary-card metadata
- Site-wide `Person`, `WebSite`, and page structured data

`sitemap.xml` lists indexable pages. `robots.txt` permits crawling and identifies the sitemap. `_config.yml` contains the production origin, author identity, and default social image.

The intended production origin is currently `https://jeremyehly.com`. Change `url` in `_config.yml` before deployment if the final public origin differs. Use one hostname consistently, including its `www` choice and HTTPS.

## Search positioning

Create one authoritative page for each genuine audience or service rather than repeating every term across the site:

- Speaking: generative AI speaker for architecture and design
- Consulting: generative AI consulting for architecture and design firms; professional design consulting
- Academic Leadership: design education leadership, curriculum innovation, and higher-education AI strategy
- AI Leadership: evidence, teaching, institutional work, and point of view
- Work: architecture, design, collaborators, responsibilities, and project outcomes
- Teaching: design education, course intentions, student work, and reflection

Generic terms such as `consulting` or `architecture` need specific context and evidence. Titles and descriptions should accurately reflect the page, not promise a service that the page does not yet substantiate.

## Verification

Run these before publishing:

```bash
node validate-seo.mjs
bin/jekyll build
```

After the production domain is connected, validate representative pages in Google's Rich Results Test and URL Inspection, submit `/sitemap.xml` in Google Search Console, and check the live canonical and social image URLs.
