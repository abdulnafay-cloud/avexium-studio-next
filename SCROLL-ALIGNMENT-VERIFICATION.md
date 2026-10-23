# Scroll alignment corrections

Checked 14 October 2026.

- Hero camera, headline exit and light handoff now share progress measured over the actual sticky travel. The final handoff was observed at progress 1 while the hero stage was still at top 0.
- The camera fits the physical monitor display using field of view and canvas aspect ratio. Desktop and portrait close-ups retain the complete monitor text.
- Three.js and the responsive CSS now use the same 750px breakpoint.
- Orbit placement uses the stage dimensions and allows for the transformed card bounds. Pinned stages fit short viewports rather than enforcing a taller minimum.
- Shared media/scene progress refreshes when document layout changes. The mobile film uses its actual 85svh stage height; observed progress 0.3254 matched computed travel 0.325385, and progress reached 1 at release (stage top -2.31px).

Validation: production webpack build passed compilation, TypeScript and all 34 generated entries. Standalone TypeScript and ESLint on the changed TypeScript files passed; git diff whitespace check passed. Browser checks covered the homepage at 1280x720, 390x844 and a short 1280x500 viewport. Mobile and short desktop orbit checkpoints had no card clipping or page-width overflow. Pause held the orbit phase across scrolling; resume updated it. The mobile Studio scene rendered, and focused browser checks returned no error entries.

Screenshots are saved under `C:/Users/abdul/.codex/visualizations/2026/10/14/01a13956-e8f8-7d21-8c20-84954fb73caf/` as `scroll-alignment-desktop.png` and `scroll-alignment-mobile.png`.

This was a focused check of the changed scroll and framing behavior, not a repeat of the full route sweep, physical-device testing or OS-level reduced-motion verification.
