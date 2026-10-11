# Motion revision verification — v03

Date: 5 October 2026. Application: `C:\Users\abdul\Desktop\avexium-studio-next`. Preview: http://localhost:3002/ . The original application source was not edited. The preceding Studio source is retained in `source-backup-v02`.

## Build and static checks

- Final production build passed using the installed Node runtime and `next build --webpack`.
- Next.js compilation, TypeScript checks and static generation completed successfully: 34 generated entries, representing 32 public page routes plus framework-generated entries.
- Final ESLint check of `src` exited successfully with no reported errors. This is not a claim that every backup or generated file was linted.
- The final production server was started successfully on port 3002.

## Browser scroll sweep

The final built application was checked in the in-app browser at 1280 × 720 desktop and 390 × 844 mobile viewport sizes. Each route was loaded, then scrolled with native browser gestures through its content until the bottom was reached. DOM checks ran after each scroll state.

| Coverage | Routes | Scroll checkpoints | Result |
| --- | ---: | ---: | --- |
| Desktop | 32 | 201 | All reached the bottom |
| Mobile | 32 | 192 | All reached the bottom |
| Total | 64 route/viewport combinations | 393 | No page-width overflow or completed-but-failed images found |

Coverage: Home, Services, Work, Studio, Process, Contact, Industries, Journal; ten service-detail pages; three case studies; six industry-detail pages; three articles; Privacy and Site Information.

Heading/paragraph boundary checks found no unexpected mobile clipping. Desktop initially reported the partial next journal card at the carousel edge; that is intentional clipping inside a native horizontal rail, not body overflow. Known animation/carousel containers were excluded from subsequent ordinary-text boundary checks. This is a practical layout check, not exhaustive screenshot comparison of every pixel or frame.

## Visual checks and corrections

- Opening desktop hero: visible procedural 3D workstation, readable left-aligned headline and typewritten monitor content.
- Mid-scroll: camera approaches the physical screen; the angled screen cutout remains within its bezel.
- Close-up and light handoff: screen content changes, headline letters disperse and following content arrives without the previous extra blank pinned viewport.
- Pinned service orbit: changing depth, scale and position; vertical radius corrected after cards were visibly clipped during testing.
- Mobile opening: full-height scene behind the headline; removed the old abrupt inset-canvas boundary and checked bottom-control spacing.
- Staggered projects, process panels and shared page responses were included in the route scroll sweeps.

## Interaction checks

- Global Pause/Play: pressed state changed; service-orbit inline poses remained unchanged during a subsequent scroll while paused, then updated after playback resumed.
- Industry selector: selecting Retail & commerce changed the displayed title/link and selected state. One automation selector attempt timed out after focus had already selected the area; the resulting DOM state was read and verified. This was not a page runtime error.
- Journal reel: Next advanced the rail; at its end Next became disabled and Previous remained enabled.
- Mobile menu: opening moved focus to Close menu; Escape dismissed it, returned focus to Open menu and released body scroll lock.
- Services drawer: Web development opened its technical content; Escape dismissed it, returned focus to its triggering service row and released body scroll lock.
- The current browser error log query returned no error entries. This does not certify every possible browser/device/runtime condition.

## Saved visual evidence

Screenshots are saved at:

- `C:\Users\abdul\.codex\visualizations\2026\09\01\01a05c6f-211b-7ac1-a91e-ad7877d04476\avexium-home-motion-v03.png`
- `C:\Users\abdul\.codex\visualizations\2026\09\01\01a05c6f-211b-7ac1-a91e-ad7877d04476\avexium-home-zoom-v03.png`
- `C:\Users\abdul\.codex\visualizations\2026\09\01\01a05c6f-211b-7ac1-a91e-ad7877d04476\avexium-home-orbit-v03.png`
- `C:\Users\abdul\.codex\visualizations\2026\09\01\01a05c6f-211b-7ac1-a91e-ad7877d04476\avexium-home-mobile-v03.png`

## Not certified / remaining release work

This is a reference-led motion/layout recreation with original Avexium geometry and owned imagery, not a pixel-identical clone of Junca's bespoke assets. The reference's forced large-scroll advancement was intentionally not reproduced; native incremental scrolling remains available.

OS-level reduced-motion emulation, full assistive-technology and keyboard coverage, cross-browser/device testing, low-end GPU performance, live audio quality, backend delivery and deployment were not comprehensively tested in this revision. Reduced-motion handling exists in code/CSS; this is not a claim that its complete OS/browser interaction was verified.

Independent dependency installation, remaining original portfolio migration, final bespoke imagery, real enquiry/application endpoints, legal content, SEO/canonical configuration and a full accessibility/performance audit remain. The contact brief still prepares an email draft; it does not submit to a backend. Do not present this preview as a production-certified replacement.
