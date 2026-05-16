# Development Setup

## Environment

Copy `.env.example` to `.env.local` and fill in the values.

Frontend values:

```txt
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_BASE_URL=http://127.0.0.1:8787
```

Worker and ingestion values:

```txt
CLERK_SECRET_KEY=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_D1_DATABASE_ID=
ADMIN_INGEST_SECRET=
INGEST_API_URL=http://127.0.0.1:8787/api/admin/ingest
```

For local Worker development, create an ignored `.dev.vars` file with:

```txt
CLERK_SECRET_KEY=
ADMIN_INGEST_SECRET=
```

## D1

Before remote deploys, replace the placeholder `database_id` in `wrangler.toml`
with `CLOUDFLARE_D1_DATABASE_ID`.

Apply local migrations:

```bash
npm run db:migrate:local
```

Apply remote migrations:

```bash
npm run db:migrate:remote
```

## Worker

Run the API locally:

```bash
npm run worker:dev -- --port 8787
```

Health check:

```bash
curl http://127.0.0.1:8787/api/health
```

## Scraper Ingestion

Scrape the configured sources into a generated JSON checkpoint:

```bash
npm run ingest:scrape
```

The source registry lives in `data/ingest-sources.json`. Supported source
types are:

- `mlh-season` for MLH hackathon seasons.
- `generic-page` for trusted one-off pages.
- `submitted-url` for one user-submitted link.
- `submitted-links` for a small batch of user-submitted links.

Every adapter emits both normalized opportunities and source reviews. Source
reviews include `decision`, `relevance_score`, `source_trust_score`,
`parse_confidence`, and `risk_flags`. Only accepted opportunities are written
to `data/opportunities.scraped.json`; quarantined and rejected links are kept
in the ignored `data/ingestion-reviews.json` checkpoint and can be pushed to D1
for debugging.

To test submitted links without editing the main registry:

```bash
npm run ingest:scrape -- --sources=data/submitted-sources.example.json
```

Push scraped opportunities through the admin ingestion endpoint:

```bash
npm run ingest:push
```

The generated `data/opportunities.scraped.json` file is intentionally ignored.
Use it as a local review checkpoint before pushing data into D1.
