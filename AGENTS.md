## Learned User Preferences

- Use `cloudflare-pages-deploy-dispatcher` as the reference for visual language (Geist, shadcn, black-bordered cards/tables) and build-time Airtable sync patterns when extending this site.
- Events list UI: columns Event, When, Where, Admission, and **View more info** (Eye header icon); no description text under event titles in the table or mobile cards.
- Main content and events table cap at 1280px (`max-w-7xl`); layout should scale down on smaller viewports without horizontal scroll.
- Event detail pages keep primary content at `max-w-3xl` within the same shell.
- Location (“Where”) values use foreground text color, not muted foreground.
- Admission **Paid** / **Free** use colored badges (`#4682B4` / `#2E6F40`, text `#F2F0EF`) with **BanknoteCheck** / **BanknoteX** icons (dispatcher-style).
- Home “Publish your event” copy links via `EVENT_PUBLISHING_FORM`; keep the URL a build secret and style the link like other muted foreground text.

## Learned Workspace Facts

- Stack: Astro 7, React, Tailwind 4, shadcn UI; scaffolded from `cloudflare-pages-deploy-dispatcher`.
- Event data is fetched at build time only: `scripts/sync-airtable-events.mjs` writes `src/generated/public-events.json`; the site does not call Airtable at runtime.
- Airtable config: base `appAaNlcIwF3BiHL2`, table `Events`, view `Events` (in `wrangler.jsonc` and `.env`); mapper expects fields such as Start Date, Location, Status (`Approved`), Event ID, Admission, Description (rich text/markdown), Event Link, Poster Image; sync uses America/Santiago.
- Local sync resolves `AIRTABLE_*` as repo `.env` first, then shell environment, then `wrangler.jsonc` vars (avoids stale PATs from other projects).
- `npm run dev` runs sync via `predev` before Astro dev; `npm run build` syncs then builds for Cloudflare Pages (`dist`).
- Event detail routes: `/events/{Event ID}` at build time; “View more info” always points at the internal detail page; external **Event Link** is used only for Join on detail.
- `EVENT_PUBLISHING_FORM` is injected at build only—`.env` locally and Cloudflare Pages **Build** environment variables; not committed in `wrangler.jsonc` `vars`.