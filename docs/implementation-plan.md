# Phase 1 implementation plan

Source: https://rivingtonmarx.com/. The content audit records exact source URLs and downloaded imagery in content-inventory.md. No CMS or production deployment in this phase.

## Proposed sitemap
Home; Portfolio; individual projects; About; Services; six individual services; Press; Journal (source Blog); individual articles; Testimonials; Contact; Privacy. Retain source slugs where practical. Audit will determine available detail pages.

## Design direction
A quiet editorial portfolio: ivory paper (#f4f1eb), espresso ink (#292720), olive accents (#77745f), restrained rules, serif display typography with practical sans-serif navigation. Generous whitespace, asymmetric project compositions, immersive residential photography. Mobile navigation collapses to an accessible menu. No invented claims or stock substitutions.

## Component architecture
App Router pages consume an asynchronous typed content repository. Local JSON is the only current provider. Shared Header, Footer, ProjectCard, PageIntro and ContactForm components own presentation. Source URLs stay in content records. A future GraphQL provider maps CMS results to these same types without changing components.

## Sequence
1. Audit source pages, sitemap, copy and imagery, recording gaps.
2. Implement local content repository and reusable responsive layouts.
3. Add project/service/editorial detail routes and honest demo contact interaction.
4. Build and typecheck; Playwright checks routes, images, links, menus, forms and overflow at 375, 390, 768, 1024 and 1440 pixels.
5. Document deployment protection, content provenance and future CMS mapping. Present local preview; production deployment requires approval.
