# The Hub Events

A small Astro site that lists upcoming community events. Visual language and build-time Airtable sync follow [cloudflare-pages-deploy-dispatcher](../cloudflare-pages-deploy-dispatcher).

## Airtable (build-time only)

The **Events** table (view **Events**) uses these columns in production:

| Field        | Required | Notes                                      |
| ------------ | -------- | ------------------------------------------ |
| Event Name   | Yes      | Title in the list                          |
| Start Date   | Yes      | Date/time (America/Santiago)               |
| End Date     | No       | Optional end time                          |
| Location     | No       | Defaults to `TBA`                          |
| Event ID     | No       | Stable public id (slug); falls back to record id |
| Status       | No       | Only `Approved` rows are listed            |
| Admission    | No       | e.g. Paid / Free (optional metadata)       |
| Description  | No       | Rich text (markdown); rendered on event page |
| Poster Image | No       | Attachment; URL captured at build time     |
| Event Link   | No       | External Join link (detail table column)   |
| Link         | No       | Legacy alias for Event Link                |

`npm run build` runs `scripts/sync-airtable-events.mjs`, which writes `src/generated/public-events.json` into the static bundle. Production does not call Airtable at runtime.

1. Copy `.env.example` to `.env` and set `AIRTABLE_TOKEN` (PAT with `data.records:read` on this base).
2. Local sync reads the repo **`.env` before** any `AIRTABLE_*` already exported in your shell (avoids a stale PAT from another project). The same IDs live in `wrangler.jsonc` `vars` for Cloudflare Pages builds (token as a **build** secret).
3. `npm run dev` runs sync before the dev server; `npm run build` syncs then builds.

### Publish-your-event link (build secret)

The home page “Publish your event” link is baked in at build time from **`EVENT_PUBLISHING_FORM`**. Do **not** put it in `wrangler.jsonc` `vars` (those are committed).

- **Local:** set `EVENT_PUBLISHING_FORM` in `.env` (see `.env.example`).
- **Cloudflare Pages:** add **`EVENT_PUBLISHING_FORM`** under project **Settings → Environment variables** for the **Build** environment (encrypted / secret). It is not read from `wrangler.jsonc` `vars`.

If unset at build time, the extra paragraph is omitted.

## Commands

| Command              | Action                                        |
| -------------------- | --------------------------------------------- |
| `npm install`        | Install dependencies                          |
| `npm run dev`        | Dev server at `localhost:4321`                |
| `npm run sync:events`| Refresh `public-events.json` from Airtable    |
| `npm run build`      | Sync, generate icons, build to `./dist/`      |
| `npm run pages:dev`  | Build and serve with Wrangler Pages locally   |

Deploy with build command `npm run build` and output directory `dist`.