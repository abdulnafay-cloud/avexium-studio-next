# Supplied UI replacement — 17 October 2026

The active website uses the complete particle-based design supplied as `Avexium_Digital2 (6).html`, including its six views, typography, service panels, cursor, page curtain, scroll choreography and particle morphs. The previous robot-based UI is no longer mounted by the root layout.

## Source and runtime

- Original supplied file: `design-reference/Avexium_Digital2.html`.
- Imported markup: `src/data/reference-markup.ts`.
- Styling: `src/app/reference.css`.
- Runtime: `public/reference/runtime.js`.
- Local libraries: Three.js r128 and Lenis 1.0.42 in `public/reference/`; these match the supplied file. Both use the MIT license. Google Fonts remains the only external font request, with native font fallbacks.
- Integration/loading: `src/app/page.tsx`, `src/app/layout.tsx`, `src/components/ReferenceScripts.tsx`.
- Regenerate the imported files with `node scripts/import-reference.cjs`. This reapplies the integration changes below. An optional argument selects a different source HTML file.

## Integration changes

The existing independent projects (Tablevori, Seluvrane and Drapeviqa) and `avexiumdigital@gmail.com` replace demonstration portfolio entries and unconfirmed email addresses. Work retains the new visual layout. Contact now submits directly to a private Neon enquiry inbox; local email previews are available without live sending. See LOCAL-OPERATIONS.md.

Direct hash routes initialize their requested view, rapid navigation is queued, page titles update, and the mobile menu manages its expanded and hidden states. Overview routes are now clean, server-rendered URLs with unique metadata; legacy hash URLs normalize to these clean paths. old Studio, Industries, Journal and concept-preview URLs return to the new homepage because the supplied design has no matching views. Privacy and site information remain available with the new theme.

Particle sizes are capped near the camera, resolution is capped at 1.5 device pixels, rendering is capped at 45fps desktop / 30fps mobile, and hidden documents skip rendering. The supplied 62,000 desktop / 26,000 mobile particle counts are retained. A static readable fallback handles WebGL initialization failures. Native reduced-motion behavior from the reference is retained.

The preview launcher now identifies the new root marker. The prior source, config and README are preserved in `source-backup-before-reference-20261017/`.

## Pages

Services selectively imports the stacked cards from `design-reference/Avexium_Digital_services-redesign.html`. Hero and closing CTA each fill at least 100svh. Cards reveal and stack with scroll; the particle and aurora palette follows the approaching service. Numbering and week claims are replaced by practical scope and technical methods. Every card retains its details button. Short mobile screens use flowing cards so all content remains reachable. Run `node scripts/check-service-scroll.cjs` to verify the deck and colour relationship.

Home: `/`; Services: `/#/services`; Work: `/#/work`; Process: `/#/process`; Careers: `/#/careers`; Start a Project: `/#/start`.

This remains a local preview. The source's role listings and remaining timeline claims should be reviewed by the owner before public launch. Public pricing bands have been removed and replaced with project-stage choices. Ten detailed service pages now provide practical scope and technology information; see `SERVICE-CONTENT-IMPLEMENTATION.md`. No hiring or enquiry backend was added.
