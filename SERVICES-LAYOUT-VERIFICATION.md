# Services layout correction — 18 October 2026

Compared all ten service panels with `design-reference/Avexium_Digital2.html`. Their content and specimens were present, but the stage wrapper collapsed around absolutely positioned panels. Explicit stage width and shrink-safe columns restore the two-column presentation. The stage's `.sw` sizing also affected the brand specimen's swatches; its padding and flex sizing are now reset separately.

Changed body horizontal overflow from hidden to clip so the viewport remains the sticky stage's scroll container. Verified the stage top stays at 0 while the selected service advances, including rail navigation through all ten services at 1280 × 720. Every service displayed its heading, tags and a nonzero-width specimen. Brand swatches measured 134 × 26 pixels.

At 390 × 844, Website design and AI and automation kept their copy, tags, project link and preview inside the viewport. No horizontal page overflow was present. Mobile stage spacing and phone specimen sizing are adapted to the available height. Services particle opacity is reduced to protect text readability while retaining the scene.

Corrections live in the reference importer and generated stylesheet so reimporting preserves them. Browser checks were performed against the webpack development preview; they do not constitute a complete device audit.

## Scroll-flow follow-up

The service handoff now follows the scroll position: the outgoing panel slides above the clipped stage as the next panel enters from below. The animated specimens stay inside their panels, and their internal animations and pointer tilt remain. The selected rail control and accessible panel update together; inactive panels are inert. Reduced-motion users receive a discrete panel change without the vertical transform.

Verified every rail control in order at desktop width: all ten selected the expected service, with exactly one current control and the stage pinned at viewport top. At 390 × 844, scrolling backward reached SEO and digital marketing with its project link and specimen visible and no horizontal overflow.

The early-logo timing was superseded on 19 October at the user's request to match the supplied example. The homepage now preserves the reference's scroll anchors: the field holds until 1.5 viewport heights before the portfolio ends, then completes its logo morph 0.35 viewport heights into the logo section. Its 7% per-frame smoothing is converted to elapsed time to preserve the reference's 60Hz response at the renderer's lower frame caps. `scripts/check-logo-timeline.cjs` compares the generated timeline directly with the original at four viewport heights. Font loading triggers remeasurement so the anchors follow final text dimensions.

The presentation scale is now 75% of the original for text, controls, cards, spacing and particle scene size. Full-viewport stage heights and responsive breakpoints remain unchanged so the reference's scroll relationships survive the smaller presentation.

Removed clipping from the root HTML element while retaining horizontal clipping on the body. With both clipped, the browser could report correct fixed/sticky element rectangles while painting the background outside the scrolled viewport. After the correction, browser inspection showed the portfolio wave and then the completed particle logo visibly rendered at logo entry (logo section top −280px at scroll position 4796px). Screenshot: `reference-logo-timing-20261019.jpg` in the task visualization folder.
