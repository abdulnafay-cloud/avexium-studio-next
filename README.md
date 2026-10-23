# Current UI — supplied particle design

The website now uses the complete UI supplied in Avexium_Digital2 (6).html. Start it with START-PREVIEW.cmd and open http://localhost:3002. See REFERENCE-IMPLEMENTATION.md for routes, source locations, regeneration and integration details. The earlier UI is backed up in source-backup-before-reference-20261017.

Owner authentication and Neon application storage are described in `CAREER-APPLICATIONS.md`. Open `/admin/signup` to create the approved owner account, then `/admin/login` to access the private inbox. Dependencies are now local to this project and locked by `pnpm-lock.yaml`.

The earlier implementation notes below are historical.

---

# Avexium Studio Next

A separate, early-stage redesign of Avexium Digital. The original website in the neighbouring avexium-digital-2.0 folder is not replaced. This project uses original art direction inspired by the coherence of Junca Studio, not its branding, copy, robot or assets.

## Start

For the current bootstrapped preview, double-click `START-PREVIEW.cmd`. After setting up independent dependencies as described below: `pnpm install`, then `pnpm dev`. Preview: http://localhost:3002. Production: `pnpm build`, then `pnpm start`.

The launcher finds the existing C: drive Node installation even when Explorer's PATH still points to the removed F: drive. It changes PATH only inside its own process, checks port 3002, builds if the production build is missing and opens the browser only after Avexium responds. Keep `preview-launcher.cjs` beside the CMD file. Keep the launcher window open while using the preview; Ctrl+C stops its own server. A second launch opens an already-running Avexium preview without starting another server. Other services are never terminated. Run `START-PREVIEW.cmd --check` for read-only launcher diagnostics. If Node is moved, the optional `AVEXIUM_NODE_EXE` environment variable can specify its full executable path.

Local preview bootstrap: the offline package-manager mirror could not resolve the requested pnpm package. A Windows junction currently points this project's `node_modules` at the already-installed original project's dependencies. This shares dependency files only; source, public assets and build output are separate. Do not run dependency updates against this junction. Before distributing or independently installing this project, unlink the junction itself (not its target) and install from this package manifest. Build/dev scripts use webpack to support this local bootstrap.

## Reference-led redesign

- Independent Next.js 16 / React 19 / TypeScript application.
- Black/white/red visual system, restrained editorial typography and page-specific layouts.
- Original Three.js optical workstation, animated atmospheric shader and separate Studio identity scene; native scroll-driven camera poses, motion pause and reduced-motion support.
- Homepage with actual existing portfolio assets, labelled self-initiated.
- Native dialog menu; service detail drawers with previous/next controls; project grid/list view; technical service routes.
- Scroll reveals, text scramble, media parallax, floating service composition and route entrance animations.
- Work, Services, Studio, Process, Contact, Industries and Journal with original content and nested detail routes.
- Project enquiries submit directly to Neon and appear in the private owner dashboard; notification previews remain local.
- Optional, off-by-default original synthesized ambience; audio stops when hidden or navigating away.

See `REFERENCE-STUDY.md` for review coverage, implemented patterns and deliberate differences from the reference. This is inspired by its interaction language, not a pixel-identical copy or reuse of its models/media.

The latest homepage scroll revision is documented in `MOTION-STUDY.md`. See `MOTION-VERIFICATION.md` for the desktop/mobile scroll sweep, interaction checks, screenshots and remaining limitations. Revision styles live in `src/app/motion-revision.css` after the base theme.

## Still to complete

Direct enquiry/application backends, private owner access, SEO routes/assets, concept case studies and local operational tools are implemented. Production domain/email configuration, offsite scheduling and deployed-device QA remain. See LAUNCH-REVIEW.md and LOCAL-OPERATIONS.md. Reference music and proprietary models/media are not included.

Scene: `src/components/KineticScene.tsx`. Theme: `src/app/globals.css`. Homepage: `src/app/page.tsx`.
