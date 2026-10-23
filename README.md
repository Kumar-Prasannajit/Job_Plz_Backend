# JobPlz Backend

AI-powered job suggestion backend that parses resumes, generates embeddings, and recommends matching jobs.

> **Under Development** — Core features are working: authentication, resume upload with AI-powered extraction, Zod validation, and embedding generation pipeline.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL + Drizzle ORM + pgvector
- **Auth:** Clerk (webhooks + JWT middleware)
- **AI (extraction):** Google Gemini — turns raw resume text into the structured canonical resume JSON
- **AI (embeddings):** Ollama (`nomic-embed-text`, 768 dimensions) — used for **both** resume chunk embeddings and job chunk embeddings. Gemini is not used for embeddings anywhere in the codebase.
- **Storage:** Cloudinary (resume PDFs)
- **Queue:** BullMQ + Redis (background job processing)
- **Validation:** Zod

## Features

- **Authentication** — Clerk-based auth with webhook sync for user creation
- **Resume Upload** — PDF upload → Cloudinary storage → text parsing → AI extraction
- **Canonical Resume Schema** — Structured resume data (skills, experience, education, projects, etc.)
- **Zod Validation** — End-to-end validation for all request payloads and resume schemas
- **AI Embedding Pipeline** — Resume/Job chunking → Ollama (`nomic-embed-text`) embedding generation → pgvector storage (768 dimensions)
- **Job Scraper** — Google Jobs provider with raw job ingestion and a BullMQ processing queue
- **Weekly Scheduler** — ⚠️ Not yet implemented. The intended scaffold lives at `src/scheduler/weekly.scheduler.ts` (currently empty, with no npm script). Job scraping today must be triggered manually via the scraper API route (see below).

## Prerequisites

Install these first:

- **Node.js 24**, the version this project is developed and tested on (see `.nvmrc`; with nvm, run `nvm use`)
- **PostgreSQL** with the **pgvector** extension *installed*. The first migration enables it with `CREATE EXTENSION IF NOT EXISTS vector`, but the extension itself has to exist on the server.
- **Redis** (used by BullMQ for the job-processing queue)
- **[Ollama](https://ollama.com)** for embeddings
- **Docker** (optional, but the easiest way to get Postgres + pgvector and Redis)

You also need accounts for these services; each gives you keys for `.env`:

| Service | Used for | Where to get the keys |
| --- | --- | --- |
| [Clerk](https://dashboard.clerk.com) | Auth | Your app → **API keys** (`CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`); the webhook signing secret comes in step 6 below |
| [Cloudinary](https://console.cloudinary.com) | Resume PDF storage | Dashboard → **API keys** (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) |
| [Google AI Studio](https://aistudio.google.com/apikey) | Gemini resume extraction | `GEMINI_API_KEY` (`GEMINI_MODEL` is pre-filled in `.env.example`) |

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Kumar-Prasannajit/Job_Plz_Backend.git
cd Job_Plz_Backend
npm install

# The scraper drives a real Chromium browser; npm install does not download it
npx playwright install chromium
```

### 2. Start Postgres (with pgvector) and Redis

With Docker:

```bash
docker run -d --name jobplz-postgres -p 5432:5432 \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=job_plz \
  pgvector/pgvector:pg17

docker run -d --name jobplz-redis -p 6379:6379 redis:7
```

These match the defaults in `.env.example`. If you use your own Postgres instead, create an empty `job_plz` database, install pgvector on that server, and adjust `DATABASE_URL`.

### 3. Start Ollama and pull the embedding model

```bash
ollama serve                 # skip if the Ollama desktop app is already running
ollama pull nomic-embed-text
```

### 4. Configure environment variables

```bash
cp .env.example .env         # Windows PowerShell: Copy-Item .env.example .env
```

Fill in the Clerk, Cloudinary and Gemini keys (see the table above). The app checks these at startup and exits with a list of anything missing: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_WEBHOOK_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL`. `CLERK_WEBHOOK_SECRET` comes from step 6; any placeholder lets the server start until then.

### 5. Create the database tables and start the server

```bash
npm run db:migrate
npm run dev                  # http://localhost:5000
```

Check it's up: `curl http://localhost:5000/health`

### 6. Connect the Clerk webhook (required for login to work)

Users are written to the database **only** by the Clerk webhook (`user.created`, `user.updated`, `user.deleted` → `POST /api/v1/webhooks/clerk`). Without it, every logged-in request returns **404 "User not found"**, because the user signed in on Clerk but has no row here.

Clerk can't reach `localhost`, so expose the server with a tunnel:

```bash
ngrok http 5000              # or: cloudflared tunnel --url http://localhost:5000
```

1. In the Clerk Dashboard, open **Webhooks** → **Add Endpoint**.
2. Endpoint URL: `https://<your-tunnel-host>/api/v1/webhooks/clerk`
3. Subscribe to `user.created`, `user.updated` and `user.deleted`.
4. Copy the endpoint's **Signing Secret** (`whsec_...`) into `CLERK_WEBHOOK_SECRET` in `.env`, then restart `npm run dev`.

Sign up a user in your frontend (or create one in the Clerk Dashboard); the server log shows `USER_CREATED event received` and the user appears in the `users` table. Free tunnel URLs change on restart, so update the endpoint URL when they do.

### 7. (Optional) Make yourself an admin

Every new user gets the `USER` role. The `/api/v1/admin/dashboard/*` routes need `ADMIN`, and there's no API for that yet, so set it in the database (for example with `npm run db:studio`, or with SQL):

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
```

Note: routes that require `USER` reject admins with 403, so use a separate account for each role.

### 8. Scrape jobs and process them

In a second terminal (see "Background Queue & Worker" below for details):

```bash
npm run scraper              # scrape Google Jobs and queue the results
npm run worker               # process the queue into jobs + embeddings; leave it running
```

## Database

Schema lives in [src/db/schema.ts](src/db/schema.ts) (tables, enums, relations, and the inferred `User`/`Resume`/`Job`/etc. types used everywhere instead of a generated client). [src/db/client.ts](src/db/client.ts) owns the single `pg.Pool` and exports the Drizzle `db` instance. Migration SQL lives in `drizzle/`, generated by `npm run db:generate` from `schema.ts` and applied with `npm run db:migrate`.

This project migrated from Prisma to Drizzle — the two pgvector columns (`resume_embeddings.embedding`, `job_embeddings.embedding`, both `vector(768)`) now use Drizzle's native `vector()` column type and `cosineDistance()`-based queries instead of hand-written `$queryRaw`/`$executeRawUnsafe` SQL.

## Background Queue & Worker

There are **two separate embedding paths** in this codebase, and only one of them needs a worker:

| Pipeline | Trigger | Embedding runs... |
| --- | --- | --- |
| **Resume embeddings** | `POST /api/v1/resumes/:id/finalize` | **Synchronously**, inside the HTTP request. No queue/worker involved. |
| **Job embeddings** | Job scraper → `RawJob` saved → enqueued on the `job-processing` BullMQ queue | **Asynchronously**, inside the `job-processing.worker.ts` worker process, which must be running separately. |

### Daily workflow — scraping jobs end to end

This is the actual sequence to run, in order, to go from "no jobs in the DB" to "canonical jobs with embeddings ready to match against":

1. **Make sure the always-on services are running first** (once per machine session, not per scrape):
   - PostgreSQL (migrated: `npm run db:migrate`)
   - Redis
   - Ollama (`ollama serve`, with `nomic-embed-text` pulled)
2. **Terminal 1 — start the API server:**
   ```bash
   npm run dev
   ```
3. **Terminal 2 — run the scraper:**
   ```bash
   npm run scraper
   ```
   This runs `src/scripts/run-scraper.ts`, which calls the same `scraperService.scrape()` that `POST /api/v1/scrapers/:providerId/run` calls — it scrapes the Google Jobs provider, inserts new listings as `RawJob` rows, and enqueues each one onto the `job-processing` BullMQ queue. It exits when scraping is done; **queued jobs just sit in Redis until a worker picks them up.**
4. **Terminal 2 (after the scraper exits) — start the worker:**
   ```bash
   npm run worker
   ```
   This runs `src/scripts/job-processing.worker.ts`, which starts a long-lived BullMQ `Worker` that drains the `job-processing` queue: for each queued `RawJob` it builds the canonical `Job`, generates its embeddings via Ollama, and saves both. **Leave this running** — it keeps consuming until you stop it (`Ctrl+C`), and it's fine to start it before step 3 too (it'll just idle until there's something queued).

You don't have to run the scraper and worker in that exact order every time — the worker can already be running and idle, and a fresh `npm run scraper` will just feed it. The one thing that matters is: **nothing gets processed into canonical jobs until the worker is running**, no matter how many times you scrape.

### Useful queue scripts

Run these with `tsx` (e.g. `npx tsx src/scripts/check-queue.ts`):

| Script | Purpose |
| --- | --- |
| `npm run scraper` (`src/scripts/run-scraper.ts`) | Manually trigger a scrape — same effect as `POST /api/v1/scrapers/google/run` |
| `src/scripts/check-queue.ts` | Print job counts (waiting/active/completed/failed/delayed/paused) for the `job-processing` queue |
| `src/scripts/test-queue-status.ts` | Print job counts plus details of any failed jobs |
| `src/scripts/requeue-pending-jobs.ts` | Re-enqueue every `RawJob` still stuck in `PENDING` status (useful after the worker was down or a bug is fixed) |
| `src/scripts/test-job-queue.ts` | Enqueue a single existing `RawJob` from the DB, for manual testing |

Everything else in `src/scripts/` was one-off debugging/exploration (Google provider diagnostics, embedding pipeline dry-runs, etc.) and lives in `src/scripts/debug/` to keep it separate from the operational scripts above.

## API Routes

**Access:** *Public* = no login. *USER* / *ADMIN* = Clerk session token (`Authorization: Bearer <token>`) for a user with that role; other roles get 403.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/health` | Public | Health check |
| POST | `/api/v1/webhooks/clerk` | Svix signature | Clerk webhook (raw body); creates/updates/deletes users |
| GET | `/api/v1/users/me` | Any logged-in user | Current user, including role |
| POST | `/api/v1/resumes/upload` | USER | Upload & parse a resume (multipart, PDF in field `resume`) |
| GET | `/api/v1/resumes/:resumeId` | USER | Get resume by ID |
| PUT | `/api/v1/resumes/:resumeId` | USER | Update resume data |
| POST | `/api/v1/resumes/:resumeId/finalize` | USER | Generate embeddings (synchronous) |
| GET | `/api/v1/recommendations/:resumeId` | USER | Jobs matched to a resume |
| GET | `/api/v1/dashboard` | USER | User dashboard |
| GET | `/api/v1/jobs/:jobId` | Public | Get a job by ID |
| GET | `/api/v1/admin/dashboard/overview` | ADMIN | Raw job counts by status, plus total jobs and embeddings |
| GET | `/api/v1/admin/dashboard/sources` | ADMIN | Raw job counts by platform and status |
| GET | `/api/v1/admin/dashboard/recent-jobs` | ADMIN | Recently added jobs |
| GET | `/api/v1/scrapers/providers` | Public | List available scraper providers |
| POST | `/api/v1/scrapers/:providerId/run` | Public ⚠️ | Run a scraper (`google`), saving `RawJob`s and enqueueing them for processing |

## Scripts

```bash
npm run dev              # Dev server with watch
npm run build            # Compile TypeScript
npm run start            # Run compiled server (dist/server.js)
npm run scraper          # Manually run the Google Jobs scraper (see "Daily workflow" above)
npm run worker           # Start the job-processing BullMQ worker (must be running for scraped jobs to be processed)
npm run typecheck        # Type-check without emit
npm run db:generate      # Generate a migration from src/db/schema.ts changes
npm run db:migrate       # Apply pending migrations to the database
npm run db:push          # Push schema.ts straight to the DB, skipping migration files (dev convenience only)
npm run db:studio        # Open Drizzle Studio
```

## Known Issues

- The "weekly scheduler" is not implemented yet (scaffold sits unwired at `src/scheduler/weekly.scheduler.ts`, no npm script); scraping must be triggered manually via the API.
- The resume enhancement module (`src/modules/enhancement/`) is an empty placeholder and isn't mounted in `app.ts` yet.
- The scraper routes (`/api/v1/scrapers/*`) have no authentication, so anyone who can reach the server can start a scrape. Fine for local development; protect them before deploying.

The app now validates required env vars at startup (`src/config/env.ts`) and exits with a clear message listing what's missing, instead of failing later with an obscure error the first time an unset value is used.
