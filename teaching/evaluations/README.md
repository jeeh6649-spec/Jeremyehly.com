# Student Evaluation Quote Library

This library contains 55 selected comments from official course evaluations, organized as five quotations for each of the 11 course pages with available evaluation evidence.

The canonical data source is `/_data/student_evaluation_quotes.json`. Jekyll exposes it as `site.data.student_evaluation_quotes` so page templates, sliders, and future components can use the same source without copying quotations into JavaScript or HTML.

`all-course-quotes.md` is the readable editorial view of the same data. Regenerate it after changing the canonical JSON with:

```bash
node scripts/export-student-quotes.mjs
```

## Editorial Policy

+ All comments are anonymous.
+ Student wording is preserved.
+ Obvious PDF extraction errors, spelling, capitalization, and punctuation are lightly normalized.
+ Ellipses indicate omitted text.
+ Sensitive personal disclosures are excluded.
+ Excerpts do not omit criticism when doing so would materially distort the student's meaning.
+ These are editorial selections, not a statistical summary of all responses.

## Strongest Site-Wide Quotes

### Teaching Excellence

> "Genuinely one of, if not the best-taught classes I have taken at CU Boulder, coming from a senior who is about to graduate. ... Throughout this class, my perspective on AI has continued to change and I have learned a lot, and I hope this class continues to be taught."

Generative Design with AI | Spring 2024

> "I have thoroughly enjoyed being in Jeremy's studio this semester. I sometimes feel as though ENVD can prioritize having designers as professors and neglect the teacher aspect of a person, but Jeremy is both. He has been the most well-rounded professor that I have had in a studio. Everything he assigns is thought out and complete."

Museum of Analog Experience | Spring 2025

### Perspective And Purpose

> "This studio has been one of the most interesting, fun, and rewarding studios I have taken. It has transformed my thought process and shifted my perspective toward thinking about nonhumans in design."

Urban Rewilding Studio | Fall 2025

> "What is taught in this class has helped me fundamentally understand why I am in this major at all, let alone the specialty. It should be a required lecture for students in their third semester before declaring a specialty."

Theory and Ethics of Design | Fall 2025

### Critique And Agency

> "Jeremy is an incredible instructor. His feedback is not dead. It's active and alive and pushes his students to develop a stronger sense and agency in a design. It's amazing to see a teacher that cares about his students' wellbeing and passions as well."

Graphic Design and Portfolio | Fall 2022

> "This is the best ENVD class I have taken. Jeremy is the most hands-on professor I have ever had and has a great way of offering critiques without being too harsh or not harsh enough."

Luminaire Studio | Fall 2024

### Growth And Consequence

> "This course was amazing. I learned more in it just in this semester than I have my entire student career."

Design-Build Studios | Spring 2018

> "Transferring into ENVD was really scary because of that learning curve. You made that transitional period really easy while providing really great support. This course was a really great taste of design school and you really put the spark in for the future."

Studio I | Environmental Product Design | Spring 2023

### Relevance And Rigor

> "This class was one of the most beneficial and applicable classes I have taken in college. ... Jeremy enabled my individual curiosities and consistently pushed me to the next steps and to find new use cases. ... Many of the tools I now use daily. This is a class that I view as essential for designers as they leave college and enter the workforce."

Generative Design with AI | Spring 2026

> "Most effective: Everything. Fantastic course, could not have been conducted better. Incredibly educational, rigorous and enjoyable. Least effective: N/A."

Advanced Digital Modeling with Rhino | Fall 2020

## Placement Guidance

+ Use one featured quote on the homepage, preferably the teaching-excellence or perspective-change evidence.
+ Use three to six rotating quotes on the Teaching index, drawing from different course levels and years.
+ Use one primary quote on each course page, with the remaining selections available for a secondary reflection or evaluation section.
+ Use the AI-specific quotes on AI Leadership rather than repeating generic praise there.
+ Keep attribution factual: course title, term, and `Anonymous student course evaluation` where space allows.
+ Do not place several superlative comments together. One strong quotation surrounded by project evidence feels more credible than a wall of praise.

## Jekyll Access

```liquid
{% assign evaluations = site.data.student_evaluation_quotes %}
{% assign featured_ids = evaluations.featuredQuoteIds %}
```

The existing course pages and Teaching slider still contain manually entered quotations. They can be migrated to this data source after the other active website work has settled.
