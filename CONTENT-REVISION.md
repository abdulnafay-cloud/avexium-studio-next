# Website content and layout revision — 21 October 2026

The public copy now describes actual capabilities, project inputs, scope, reviews, acceptance checks and handover. Reference slogans, unverified team claims, fixed week promises and unconfirmed vacancy language have been replaced.

- Home: a direct “From idea to launch.” headline; business-focused introduction; clear capability descriptions; honest project context; practical brand-system explanation; Define / Design / Build / Launch stages; a specific project-enquiry invitation.
- Services: a service-led introduction, existing technical summaries and clear scoping invitation.
- Work: explicit self-initiated project context, readable project descriptions and an empty-category message.
- Process: scope, design, implementation and release outputs instead of a promised nine-week schedule or unconfirmed support period.
- Careers: collaboration and portfolio enquiries instead of confirmed vacancies or claims about staff, employment terms and workplace arrangements.
- Enquiries: a useful brief introduction, visible field labels, project prompts and an explanation of direct submission and private storage.
- Service details: professional scope, implementation, deliverable and acceptance-check headings. Existing detailed technical information is retained.
- Privacy and Site Information: factual customer-facing explanations of current functionality and project status, with shared navigation and a readable information grid. Business/legal production approval is still required before launch.

`scripts/site-content.cjs` applies customer-facing copy after the reference importer. `src/app/editorial.css` defines the shared alignment, reading widths, heading hierarchy and responsive layout. Animation IDs and section order are preserved. `scripts/check-site-content.cjs` guards the reviewed copy and runtime hooks; existing service and logo-timeline checks remain applicable.
