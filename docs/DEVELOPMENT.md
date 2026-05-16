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

Push scraped opportunities through the admin ingestion endpoint:

```bash
npm run ingest:push
```

The generated `data/opportunities.scraped.json` file is intentionally ignored.
Use it as a local review checkpoint before pushing data into D1.
