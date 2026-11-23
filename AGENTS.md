## Learned User Preferences

- Use `cloudflare-pages-deploy-dispatcher` as the reference for visual language (Geist, shadcn, black-bordered cards/tables) and build-time Airtable sync patterns when extending this site.
- Events list UI: columns Event, When, Where, and Admission only—no Link column and no description text under event titles in the table or mobile cards.
- Main content and events table cap at 1280px (`max-w-7xl`); layout should scale down on smaller viewports without horizontal scroll.
- Location (“Where”) values use foreground text color, not muted foreground.

## Learned Workspace Facts

- Stack: Astro 7, React, Tailwind 4, shadcn UI; scaffolded from `cloudflare-pages-deploy-dispatcher`.
- Event data is fetched at build time only: `scripts/sync-airtable-events.mjs` writes `src/generated/public-events.json`; the site does not call Airtable at runtime.
- Airtable config: base `appAaNlcIwF3BiHL2`, table `Events`, view `Events` (in `wrangler.jsonc` and `.env`); mapper expects fields such as Start Date, Location, Status (`Approved`), Event ID, Admission, and Poster Image.
- Local sync resolves `AIRTABLE_*` as repo `.env` first, then shell environment, then `wrangler.jsonc` vars (avoids stale PATs from other projects).
- `npm run dev` runs sync via `predev` before Astro dev; `npm run build` syncs then builds for Cloudflare Pages (`dist`).