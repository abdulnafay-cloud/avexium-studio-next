# Junca reference study and Avexium implementation

Reviewed 5 October 2026. Reference: https://juncastudio.com/

## Coverage

Opened the homepage, Projects, Studio, Services, Industries, News, Contact, legal notice and privacy policy. Opened all 8 linked project pages, all 6 linked industry pages and all 16 linked article pages. Inspected page structure on each; visually sampled each page family. Tested the menu, service detail drawer and next-service control, project list/grid toggle and native scrolling. Inspected the homepage at desktop and 390×844 mobile size.

This is not a claim that every animation frame or every responsive breakpoint has been inspected. Form submission, sound playback and external client websites were not tested.

## Observations

- Black cinematic home hero with red-lit assistant and moving red atmosphere. Head, screen and turbine animate as a coordinated scene; scrolling changes the composition.
- Desktop hero message sits left over the scene; mobile puts the message above the assistant.
- Restrained sans-serif typography, mostly 35–60px headings on desktop, white editorial sections, small neutral metadata and restrained red accents. The previous oversized copper hero was not equivalent.
- Fixed logo/menu adapt to dark/light content. Secondary navigation collapses as the page scrolls. Menu uses an animated large side panel with recent work and supporting links.
- Homepage service sequence pins its central title while media and service fragments move around it. It is not a plain row of cards.
- Services has a monochrome moving background, tilted project strip, large service rows and a slide-in detail panel with previous/next service controls.
- Projects has grid/list views. Case studies put metadata and large media ahead of a two-column narrative, expandable supporting detail and next/previous work.
- Studio has an independent red 3D identity scene. Industries and articles reuse clear, consistent editorial templates instead of applying the same hero everywhere.
- Contact uses a calm, labelled two-column form. Footer combines a large contact invitation, useful navigation and a large wordmark.

## Implemented in the separate Avexium project

- Black/white/red theme and reduced heading scale; consistent alignment and responsive spacing.
- Original procedural Avexium optical workstation in Three.js, with environment-lit materials, custom display, fan, pointer tracking and scroll-driven camera/model poses. No Junca model or assets used.
- Animated shader atmosphere; separate original 3D identity scene for Studio.
- Native scroll-based sticky hero, floating service composition, media parallax, intersection reveals, restrained text scramble and route entrance.
- Native dialog menu and service drawer with keyboard focus handling, Escape, previous/next controls and full technical route links.
- Work grid/list toggle, truthful self-initiated labels, case metadata, full project media, expandable build thinking and continued exploration.
- Page-specific layouts for Work, Services, Studio, Process, Contact, Industries and Journal. Original industry focus descriptions and 3 original short practice notes, not copied reference articles.
- Contact brief validation and explicit email-draft preparation, not fake successful submission.
- Off-by-default original synthesized ambience with an explicit Sound control; no reference audio copied.
- Reduced-motion behavior, pause controls, WebGL fallback, responsive scene framing, offscreen/hidden rendering skips and WebGL resource disposal.

## Deliberate differences and remaining release work

The reference's exact robot, inflated brand letters, proprietary media, client logos, endorsements, audio and editorial copy are not reused. Avexium uses original procedural artwork and existing owned project images. Pixel-identical matching is not claimed. Further bespoke project photography/3D media, independent dependency installation, real enquiry/application backend migration, complete portfolio migration, deployment/legal/SEO configuration and full performance/accessibility testing remain separate release work.

## Second visual comparison and revision

Revisited all nine main reference routes and sampled their live states at desktop width. Rechecked the services drawer, expanded menu, projects index, industry detail and contact layouts. The earlier implementation followed some patterns but missed important proportions and page-family relationships.

Corrections in this revision:

- Sparse monochrome smoke ribbons and halftone texture instead of a full-screen fog blanket. Services has explicit two-line typography and larger continuously moving project previews.
- Homepage hero pinning adjusted to the reference's observed 260vh desktop scene length. The original Avexium model has a faceted monitor housing, more rounded body, physical vents and a recessed turbine. No reference model is downloaded or embedded.
- Studio uses four independently modelled, red-metallic inflated A marks. The old single letter and orbital rings are removed.
- Services now has a ruled introduction, balanced editorial columns, project imagery and media-led detail drawers with previous/next controls, close autofocus and focus restoration.
- The portfolio opens in a compact list with three cropped views of each existing project image, with a two-column grid alternative. These crops are not presented as additional projects or new delivered features.
- Added image-led industry exploration with native horizontal scrolling and controls, sector-specific planning detail, journal category filters, article contents links and visual previous/next case navigation.
- Home now connects into focus areas and original practice notes. Studio has a capability/focus/process directory. Contact and Process have page-specific layouts.
- White editorial footer, refined navigation columns, finer paper texture, more restrained shared heading sizes and fixed-width text animation to reduce layout movement.
- Added accurate preview privacy and site-information pages. They explicitly identify missing production legal/hosting configuration rather than inventing a registered business identity or copying French legal text.

The reference contains client photography, custom assets and validated testimonials that Avexium does not currently have. No fake client logos, team photos, ratings, endorsements or performance figures were added to fill those spaces.
