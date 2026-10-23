# Launch review — local implementation, 23 October 2026

## Completed locally

1. Direct project enquiries: validated submissions saved to Neon, private owner inbox at /admin/enquiries, consent, spam controls, retry deduplication and a persistent notification queue. Local email previews are available; live sending stays inactive.
6. SEO: clean server-rendered overview routes, unique titles/descriptions, canonical URLs, service/career/case metadata, generated social image, particle-brand favicon, robots and sitemap generators. Existing animated transitions and legacy hash links remain supported. Local indexing is disabled until the real HTTPS PUBLIC_SITE_URL is configured.
7. Business content: three complete independent case-study pages, original project imagery, clear design decisions and production-scope limitations. Work cards now open each study. No invented clients, testimonials or commercial results. Collaboration pages disclose that opportunities are not confirmed vacancies. Privacy and Site Information describe direct submission and private storage.
8. Operations: fixed-code server error events, owner-only health endpoint, encrypted and verified database/PDF backups, non-destructive restore preview, retention dry runs, queued notification processing and environment checks. No external paid service or recurring deployment job has been activated.

See LOCAL-OPERATIONS.md for commands and configuration.

## Still needed for a real deployment

- Choose domain and host; configure production environment values, HTTPS APP_URL, PUBLIC_SITE_URL and Neon trusted origins. Rotate the database credential previously shared in chat.
- Choose and verify the sender/provider if owner email notifications are wanted. Neon account verification emails have separate provider configuration.
- Schedule notification processing and encrypted backups, copy backups offsite, secure a separate copy of the encryption key, and rehearse recovery in a staging database. Approve retention periods and include backups/email previews in deletion procedures.
- Connect external uptime/error alerts or host log monitoring; configure shared/host-level submission limits for multiple server instances.
- Confirm public business/publisher information and contact ownership. Add real vacancy terms only when hiring is confirmed; add commissioned case studies only with evidence and permission.
- Complete phone, accessibility and lower-powered-device performance checks on the deployed site. Existing local checks do not establish production performance or legal compliance.

No paid service was purchased, no email notification was sent and the website was not deployed publicly.
