# Replacement UI verification

The final production build passed webpack compilation, TypeScript and static generation (35 generated entries, including retained legacy routes). ESLint passed for the changed application entry points, script loader, legal pages and Next.js config. Imported runtime JavaScript passed Node syntax checking.

`node scripts/check-reference-http.cjs` passed against the production preview: six embedded page views, existing project content, removed persistent controls, seven legacy redirects, legal pages, local animation libraries, project assets and runtime guards. `node preview-launcher.cjs --check` identified the running Avexium preview and confirmed the production build and dependencies.

Browser checks against the production preview covered Home, Services, Work, Process, Careers and Start a Project. The particle scene rendered; service panels changed with scrolling; the Brand filter showed Seluvrane and Drapeviqa; Process exposed four stages and Careers four source-provided roles.

The form prepared an email draft using synthetic test details. The draft contained the selected service, budget and message, with the correct recipient and line breaks. The interface explicitly stated that nothing had been sent or stored. Edit Brief returned focus to the name field. No email draft was opened and no email was sent.

At 390 × 844, the mobile menu opened and navigated back to Home, closing afterward. The final mobile document width was 390px with a 390px viewport; all footer links stayed inside the viewport after the wrapping correction. The viewport was restored and the final desktop homepage had no page-width overflow or active WebGL fallback.

The old temporary development tab became unresponsive during early checks. The imported runtime was corrected before the final production checks: literal selector preservation during generation, bounded particle sizes, frame limiting, direct route initialization and the static WebGL fallback. Earlier initialization errors are historical and were not treated as passing checks.

This is focused desktop/mobile preview verification, not a complete browser/device, accessibility, low-end GPU or public deployment audit. Careers, business copy and timing/budget claims were supplied in the reference and require owner review before publication.

Screenshot: `C:/Users/abdul/.codex/visualizations/2026/10/14/01a13956-e8f8-7d21-8c20-84954fb73caf/replacement-home-20261017.jpg`.
