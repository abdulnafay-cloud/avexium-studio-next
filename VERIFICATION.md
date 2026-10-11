# Reference-led revision verification

Date: 2026-10-05. Application: `C:\Users\abdul\Desktop\avexium-studio-next`.
Preview: http://localhost:3002/services. The original `avexium-digital-2.0` application was not edited for this revision.

## Checks completed

- Final production build (`next build --webpack`): passed, including TypeScript and static generation.
- ESLint over `src`: passed.
- All 32 public routes visited at 390 × 844: every route had its primary heading, no horizontal document overflow, and no completed image with a failed intrinsic size. This is a structural route check, not a complete visual audit of every scroll position.
- Desktop Services hero and mobile Studio animation: visually reviewed and screenshots saved.
- Desktop expanded menu: 660px client height and 660px scroll height; no internal vertical overflow at the tested desktop size. Escape closed the menu and returned focus to its trigger.
- Service drawer: service-specific media, previous/next navigation, close autofocus, Escape closing and trigger-focus restoration verified. Mobile drawer checked for horizontal overflow.
- Work list/grid switch and journal Engineering filter verified.
- Industry carousel advanced and disabled Next at its actual scroll boundary.
- Studio Pause motion changed to Play motion; Play restored animation.
- Native scrolling and navigation hiding on scroll verified.
- Fresh final preview tab had no captured console errors at the final Services check. This is not a historical console audit of every route.

## Public route coverage

Main pages: `/`, `/services`, `/work`, `/studio`, `/process`, `/contact`, `/industries`, `/journal`, `/privacy`, `/site-information`.

Service details: `/services/digital-marketing`, `/services/seo-content`, `/services/brand-design`, `/services/ui-ux-design`, `/services/web-development`, `/services/mobile-development`, `/services/ecommerce`, `/services/automation-ai`, `/services/cloud-devops`, `/services/3d-motion`.

Work details: `/work/tablevori`, `/work/seluvrane`, `/work/drapeviqa`.

Industry details: `/industries/hospitality`, `/industries/retail-commerce`, `/industries/creative-businesses`, `/industries/business-operations`, `/industries/digital-products`, `/industries/growing-brands`.

Journal details: `/journal/designing-complete-journeys`, `/journal/motion-with-a-purpose`, `/journal/a-useful-technical-handover`.

## Evidence

- Desktop Services: `C:\Users\abdul\.codex\visualizations\2026\09\01\01a05c6f-211b-7ac1-a91e-ad7877d04476\avexium-services-v02.png`.
- Mobile Studio: `C:\Users\abdul\.codex\visualizations\2026\09\01\01a05c6f-211b-7ac1-a91e-ad7877d04476\avexium-studio-mobile-v02.png`.
- Reference observations and implemented differences: `REFERENCE-STUDY.md`.

## Important limits and release work

This is an original Avexium implementation informed by the reference's layout and interaction patterns. It does not include Junca's exact 3D models, imagery, audio, team profiles, client claims or article text. Portfolio descriptions identify independent work rather than inventing client engagements or results.

The contact form currently prepares an email draft, not a server-side submission. No email was sent by this verification. Real form delivery, storage, anti-abuse handling and deployment configuration remain separate release work.

The new app currently shares the original application's dependency installation through a junction; an independent clean dependency installation must be validated before deployment. Production legal notices and identity details must also be supplied. The preview privacy text is expressly not a production legal policy.

No complete assistive-technology audit, cross-browser matrix, OS-level reduced-motion test, sustained low-end GPU benchmark or production deployment test was completed. Do not interpret successful build and route checks as certification that all release risks are closed.
