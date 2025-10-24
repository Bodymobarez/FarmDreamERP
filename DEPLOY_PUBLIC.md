# Public deployment options

This repo is ready to deploy in two easy ways without any team/SSO restrictions:

## Option A) Vercel (personal scope)

1) Import the repo into a new Vercel project under your personal account (not a team):
   - New Project → Import GitHub → select `Bodymobarez/FarmDreamERP`.
   - Framework preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist/public`
   - Environment Variables: optional `DATABASE_URL` (if you want Neon DB); otherwise it uses in-memory storage.
2) Click Deploy. After deploy, verify:
   - `/api/health` → 200 with `{ status: "ok" }` (and optionally `barnsCount`).
   - `/api/animals`, `/api/batches`, `/api/inventory` → 200.

Notes:
- `vercel.json` is configured for SPA routing and a single Express-based serverless function (`api/index.ts`).
- In production without `DATABASE_URL`, API falls back to `InMemoryStorage`.

## Option B) Render (free, single service)

Use the included `render.yaml` or Dockerfile.

- Via Blueprint (recommended):
  1) Go to Render → New + → Blueprint → Connect repo.
  2) Render will read `render.yaml` and create a Web Service.
  3) It runs: `npm ci && npm run build:client` then `NODE_ENV=production npx tsx server/index.ts`.

- Via Dockerfile:
  1) Create a Web Service from Dockerfile.
  2) Expose port `3000`.

Verify:
- Open the service URL then hit `/api/health`.

## Troubleshooting
- 500 on `/api/*` on Vercel: ensure you deployed the latest commit with Skip Build Cache, and that the project is under personal scope (no team SSO). Check Function logs in Vercel.
- No DB env: API still works on in-memory storage; add `DATABASE_URL` to use Neon/Drizzle.
