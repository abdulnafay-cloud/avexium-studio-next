# Cursor response revision — v04

Date: 5 October 2026. Separate application: `C:\Users\abdul\Desktop\avexium-studio-next`.

## Why the previous response felt different

The preceding scene used only a small horizontal pointer contribution on the whole model. Its monitor head was time-driven, vertical pointer movement was ignored and the atmospheric shader had no pointer input.

The live Junca homepage was compared at opposing upper-left/lower-right cursor positions. Its monitor turns and tilts independently while the enclosure remains much steadier. The smoke continues moving behind it. No claim is made that its underlying rendering algorithm or exact motion curves were recovered.

## Changes in `src/components/KineticScene.tsx`

- Independent head yaw, pitch and restrained roll driven by the pointer rather than turning the entire enclosure.
- Scene-relative coordinates normalised to -1…1 on both axes.
- Frame-rate-independent exponential easing, with small enclosure movement and independent ambient head motion.
- Pointer contribution fades as the scroll sequence settles toward the screen, preserving the existing camera choreography.
- A restrained, eased atmosphere parallax contribution affects the shader's sampling coordinates and domain warp. This is an original approximation, not a copied fluid simulation.
- Studio identity geometry also receives subtle eased pointer rotations; Services atmosphere receives the shared shader response.
- Touch pointer events do not steer the scene. Leaving the scene/window resets the target; listeners are cleaned up on unmount.
- Pause and reduced-motion states disable pointer changes. A paused scene repaints the same frozen pose while visible, rather than stopping presentation; the earlier pause test exposed a blank-canvas issue that required correction. Hidden/offscreen scenes still skip rendering. Preserving the drawing buffer alone did not resolve the browser capture/compositing problem during verification.

The preceding scene file is saved as `source-backup-v02/KineticScene-before-cursor-v04.tsx`. The original `avexium-digital-2.0` application source was not edited.

## Verification scope

The initial cursor build passed Next.js compilation, TypeScript and all 34 generated entries. The changed scene file passed ESLint. Browser screenshots confirmed distinct upper-left and lower-right head poses with an unchanged readable headline and stable base. No page-width overflow or browser error entries were found in these focused checks.

The final paused-scene repaint build passed compilation, TypeScript, generation and build finalisation. The final scene-file ESLint check exited successfully with no output.

Browser rechecks confirmed the following:

- Pause retains a visible, frozen monitor/fan/atmosphere across opposing cursor moves. Play resumes independent head tracking. These checks used full viewport screenshots; an earlier cropped screenshot comparison did not provide a reliable pixel-equality result and is not reported as passing.
- The scroll-to-screen camera approach still centres the monitor after pointer movement; no browser error entries were returned.
- At 390 × 844, the homepage scene remains visible, the headline stays within the page width and native scrolling advances the page. This is viewport testing, not a physical touch-device certification.
- The Services atmospheric scene initialises and responds without page-width overflow or reported browser errors.

Final position screenshots:

- `C:\Users\abdul\.codex\visualizations\2026\09\01\01a05c6f-211b-7ac1-a91e-ad7877d04476\avexium-cursor-left-v04.png`
- `C:\Users\abdul\.codex\visualizations\2026\09\01\01a05c6f-211b-7ac1-a91e-ad7877d04476\avexium-cursor-right-v04.png`

This focused revision does not repeat the preceding 32-page desktop/mobile sweep or certify exact reference equivalence, low-end GPU performance, OS-level reduced-motion switching or every input device. Paused but visible scenes still repaint a static pose; hidden/offscreen rendering is skipped.
