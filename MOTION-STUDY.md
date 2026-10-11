# Homepage scroll and motion revision

Reference reviewed live: https://juncastudio.com/ . Revision date: 5 October 2026.

This revision is in `C:\Users\abdul\Desktop\avexium-studio-next`. The original `avexium-digital-2.0` source was not changed. `source-backup-v02` preserves the previous Studio source.

## Observed reference sequence

At the observed 1280 × 720 desktop viewport, the homepage hero was 1872px tall (260vh). It opens with an angular red-lit workstation, left-aligned three-line text and a live status line. A substantial scroll gesture triggers a camera approach, a changing monitor screen, dispersing headline characters and a transition into the light page. Its large-gesture behavior advances differently from ordinary incremental scrolling; that forced advancement is not duplicated here.

The next sections measured 720px for the client-logo area, approximately 534px for the statement and 2448px (340vh) for the pinned services orbit. The service title stays central while fragments change position, apparent depth, size and opacity. The selected work uses staggered unequal columns, not one vertical list. Later sections include a large moving project preview, red-toned benefit panels, a full-width changing industry backdrop, horizontally scrolling articles, client-voice panels, FAQ and an editorial footer.

Services has its own approximately 1055px hero at that viewport, a status row above the headline, monochrome cloud/halftone atmosphere and large tilted project previews. Studio has a 720px opening with floating inflated brand forms, rather than the homepage's long pinned hero. Work, industry and article pages are light editorial page families. Contact uses a restrained two-column opening and labelled fields.

This turn rechecked Home, Studio, Services, Projects, Industries, News and Contact. Earlier coverage of the nine main reference routes and all linked detail pages is recorded in `REFERENCE-STUDY.md`. This does not mean every animation frame and every breakpoint was inspected.

## Implemented changes

- Rebuilt the original Avexium workstation with a deeper bevelled enclosure, metallic monitor casing, ventilation openings, recessed turbine, curved fan blades, screws, feet and a physical screen.
- Replaced the static screen graphic with an original timed/typewritten sequence, then a light editorial screen as the camera approaches. The screen is placed in front of the glass, correcting a visibility problem caught in the first browser test.
- Matched the physical screen geometry to the angled bezel opening with explicit UV mapping, correcting the rectangular display crossing its enclosure during the close-up.
- Scroll drives camera position, angle and focus, screen transition, character dispersal and the final light handoff. Progress continues through the departing hero instead of ending one viewport early and leaving a blank pinned stretch.
- The background is a moving, domain-warped procedural red atmosphere; Services uses the monochrome variant. The original reference's renderer, models, audio and artwork are not reused.
- Studio now uses original inflated A/V/E/X geometry with independent movement and more restrained surface wrinkling. It no longer pins a stationary Studio scene for 260vh.
- Added a 340vh desktop / 260vh mobile service orbit: eight original work/service fragments change depth, position, scale and opacity around a pinned title. Focused cards remain usable.
- Replaced the homepage structure with independent-work marquee, statement, service orbit, staggered project previews, studio positioning, scroll-transforming project media, four technical process panels, full-bleed focus-area selector, journal reel, honest work-evidence panels and FAQ.
- The focus-area selector responds to pointer, keyboard focus and clicks; automatic changes pause while interacting, with reduced motion or with the site pause control.
- Journal controls use native horizontal scrolling, scroll snap and proper end states.
- Added shared section reveals and restrained image-scale responses to service rows, introductory content, case metadata/media, industry directories and article sections.
- Added a persistent site-wide motion control. Pause applies to WebGL time/scroll poses, the orbit, CSS loops and automatic focus-area changes. OS reduced-motion preferences keep the message intact with a static card layout.
- Restored page-specific status placement, cleared overlapping bottom controls, reduced the footer wordmark and retained native wheel/touch scrolling and standard dialog keyboard behavior.

## Main editing locations

- `src/components/KineticScene.tsx`: all procedural 3D geometry, screen content/timing, lighting, atmosphere and camera poses.
- `src/components/HeroHeadline.tsx`: accessible headline and per-character exit parameters.
- `src/components/ServiceOrbit.tsx`: depth-based scroll orbit.
- `src/components/MotionRuntime.tsx`: shared scroll/section/media effects.
- `src/components/MotionControl.tsx`: global pause state and change event.
- `src/components/IndustryStage.tsx` and `JournalReel.tsx`: homepage interactive selectors.
- `src/app/page.tsx`: homepage content and sequence.
- `src/app/motion-revision.css`: scoped revision styling, responsive states and reduced-motion layouts.

## Intentional limits

This is not a pixel-identical clone. Exact reference-model fidelity would require its bespoke model/texture/animation assets or separately produced equivalent assets. Avexium branding, original project material and honest descriptions replace the reference's identity, client logos, endorsements, team photography, articles and commercial claims. No fake clients or testimonials were added.

Existing owned project screenshots may retain branding from the source design explorations; the independent case-study titles are not trademark-availability guarantees. Bespoke final project imagery, the remaining original portfolio migration, clean independent dependency installation, real server-side enquiries/applications, legal/SEO/deployment configuration and a full accessibility/performance audit remain release tasks. Contact continues to prepare an email draft rather than claim a completed server submission.

Final test results and screenshot paths are recorded in `MOTION-VERIFICATION.md`.
