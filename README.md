# Rivington Marx — Phase 1 client preview

A responsive Next.js App Router, TypeScript and Tailwind website using the client's existing copy and photography. Content is local JSON. WordPress, WPGraphQL, email delivery and production publishing are intentionally deferred until design approval.

## Run and verify

Use a supported Node.js LTS release and npm.

```sh
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
# In a separate terminal:
npm run test:e2e
```

The development URL is `http://127.0.0.1:3000`. The build statically exports into `out/`; run `npm run preview` (or `npm start`) to serve that directory locally and inspect the exported artifact. `next start` is not the serving method for an `output: 'export'` build.

Playwright starts or reuses the local development server. The current configuration uses installed Google Chrome (`channel: 'chrome'`). Tests cover every content route, internal links, image loading, browser errors, noindex metadata, mobile navigation, contact-demo behavior and layout overflow at 375, 390, 600, 768, 1024, 1200 and 1440 pixels. The HTML report is written to `playwright-report/`. See the task's QA report for actual execution results; the presence of tests does not by itself mean they passed.

## Content and architecture

- `src/content/site.json`: source snapshot with home, 39 page records, six service detail pages, nine projects, sixteen articles, contact information and eight press links.
- `src/content/home-design.json`: editable homepage headings and labels, source references and notes identifying proposed editorial wording.
- `src/lib/content/types.ts`: the stable presentation data contract.
- `src/lib/content/get-page.ts`: asynchronous content access functions. Components receive normalized page objects without knowing their storage source.
- `src/components/`: reusable navigation, portfolio and inquiry UI.
- `public/images/`: 164 optimized WebP images, at most 1600 pixels on the longest edge.
- `docs/content-inventory.md`: route-level source inventory and content gaps.
- `src/content/raw/`: audit snapshots of the original HTML and XML; these are source evidence, not scripts executed by the application.

The source is [rivingtonmarx.com](https://rivingtonmarx.com/), audited November 4, 2026. The page, post and portfolio sitemaps and primary navigation were inspected. Each page retains its `sourceUrl`, original SEO title, description and source-derived copy. Each image retains its original URL and caption or alt text. `/projects/` is presented as `/portfolio/`; individual project, service and article paths preserve their original slugs. Taxonomy archives and the machine-readable EntityMap are outside the redesigned content scope.

The home design includes a few proposed editorial headings, labeled in its JSON; these are not quotations or new business credentials. Team biographies, project scopes, photographer credits and original press article links remain in the snapshot. Repeated responsive/carousel copy and layout chrome were removed. Original punctuation is retained; apparent replacement characters in some Windows console output were an output-encoding issue, not damaged JSON.

Client photography is used for this requested redesign preview. The original site lists photographer credits including Tim Williams Photography and Eric Lucero Photography; per-project credit text remains attached to the corresponding page. Source attribution does not grant additional licensing rights. Confirm the client's existing photography licenses cover the final deployment before launch. One source press image could not be retrieved and was omitted without substituting a fabricated asset.

## Protected client preview deployment

No live deployment is implied by this repository. Use a separate Vercel project or a non-production branch in the intended client account, and confirm the selected project and audience before uploading. Do not attach the client's production domain or promote a preview without approval.

1. Import the repository as Next.js, retain the `npm run build` command and the static export configuration.
2. Enable Deployment Protection for preview deployments before sharing the URL. Choose authentication or password protection supported by the account, and explicitly grant the reviewers access.
3. Deploy a non-production branch, or run `npx vercel` in the intended project without `--prod`. Record the resulting preview URL and confirm its deployment succeeded.
4. Check access in a signed-out browser, then grant the client the intended review access and verify navigation on the hosted copy.
5. Keep the preview's `noindex, nofollow` metadata enabled. Noindex requests search-engine exclusion; it is not authentication or a confidentiality boundary.

Vercel distinguishes [Preview and Production environments](https://vercel.com/docs/deployments/environments). Its [Deployment Protection documentation](https://vercel.com/docs/deployment-protection) describes the available access controls; availability depends on the account's plan and settings. No credentials should be committed, added to client-side bundles or placed in a `NEXT_PUBLIC_` variable.

## Future WordPress / WPGraphQL connection

Keep the approved React layouts and replace the implementation of the content access layer. No CMS integration is required for the preview.

| Current contract | Future CMS mapping |
| --- | --- |
| `slug`, `kind` | WordPress page URI or project/service/article post type |
| `title`, `description`, `seoTitle` | Title, excerpt and reviewed SEO fields |
| `paragraphs` / `blocks` | Structured rich text or validated ACF sections |
| `images` | Media URL, alt text, dimensions, caption and photographer credit |
| home design sections | Named homepage fields with a stable shape |
| contact data | Global site settings/options |
| press `links` | Repeater of publication title, date and destination |

Implement a server-only WPGraphQL adapter that validates API responses, maps them to these types, and returns clear errors for missing required content. Add contract tests using representative CMS responses. Decide with the client whether content remains build-time static (publish triggers a rebuild) or uses server rendering/revalidation. The latter requires removing static export and choosing a server-capable deployment. Draft previews require authenticated server routes and cannot be secured by the current static files alone.

Before connecting the CMS, define post types and ACF fields, media ownership and crop rules, redirect mapping for changed routes, editorial preview authentication, cache invalidation, content migration and synchronization. Preserve image attribution and source history during import. Store CMS tokens only in server-side deployment secrets.

## Remaining integrations and launch decisions

The inquiry form is a clearly labeled demo and does not send messages. Email delivery, spam controls, consent handling, data retention and failure handling require an approved backend integration. Direct email and telephone links remain usable through the visitor's own apps. Review the privacy policy for the final implementation, approve final copy and photography, and configure production canonical URLs and search indexing only after launch approval. Analytics, marketing tags and third-party embeds have not been copied from the old site.
