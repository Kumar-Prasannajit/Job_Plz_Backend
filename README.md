# JobPlz Backend

AI-powered job suggestion backend that parses resumes, generates embeddings, and recommends matching jobs.

> **Under Development** — Core features are working: authentication, resume upload with AI-powered extraction, Zod validation, and embedding generation pipeline.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM + pgvector
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
- **Weekly Scheduler** — ⚠️ Not yet implemented. `npm run cron` points to `src/scripts/scraper.scheduler.ts`, which no longer exists — running it throws `ERR_MODULE_NOT_FOUND`. The intended scaffold lives at `src/scheduler/weekly.scheduler.ts` (currently empty, not wired to the `cron` script). Job scraping today must be triggered manually via the scraper API route (see below).

## Prerequisites

Make sure these are installed and running **before** starting the app:

- **PostgreSQL** with the `pgvector` extension enabled
- **Redis** (used by BullMQ for the job-processing queue)
- **[Ollama](https://ollama.com)**, running locally, with the embedding model pulled:
  ```bash
  ollama serve
  ollama pull nomic-embed-text
  ```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server (Terminal 1)
npm run dev

# Start the job-processing worker (Terminal 2 — see "Background Queue & Worker" below)
npm run worker
```

## Background Queue & Worker

There are **two separate embedding paths** in this codebase, and only one of them needs a worker:

| Pipeline | Trigger | Embedding runs... |
| --- | --- | --- |
| **Resume embeddings** | `POST /api/v1/resumes/:id/finalize` | **Synchronously**, inside the HTTP request. No queue/worker involved. |
| **Job embeddings** | Job scraper → `RawJob` saved → enqueued on the `job-processing` BullMQ queue | **Asynchronously**, inside the `job-processing.worker.ts` worker process, which must be running separately. |

### Correct startup order

1. **Redis** must be running first — BullMQ can't enqueue/consume jobs without it.
2. **PostgreSQL** must be running and migrated (`npx prisma migrate dev`).
3. **Ollama** must be running with `nomic-embed-text` pulled (embeddings will fail otherwise, for both resumes and jobs).
4. Start the API server: `npm run dev`
5. Start the worker **in a separate terminal**: `npm run worker`
   - This runs `src/scripts/job-processing.worker.ts`, which registers the BullMQ `Worker` for the `job-processing` queue (`src/workers/job-processing.worker.ts`).
   - The worker must be kept running for scraped jobs to ever move from `RawJob` (status `PENDING`) to a canonical `Job` with embeddings.
6. Trigger scraping to enqueue work: `POST /api/v1/scrapers/:providerId/run` (see `GET /api/v1/scrapers/providers` for valid provider IDs). Each scraped listing is saved as a `RawJob` and enqueued automatically — you don't enqueue manually in normal use.

### Useful queue scripts

Run these with `tsx` (e.g. `npx tsx src/scripts/check-queue.ts`):

| Script | Purpose |
| --- | --- |
| `src/scripts/check-queue.ts` | Print job counts (waiting/active/completed/failed/delayed/paused) for the `job-processing` queue |
| `src/scripts/test-queue-status.ts` | Print job counts plus details of any failed jobs |
| `src/scripts/requeue-pending-jobs.ts` | Re-enqueue every `RawJob` still stuck in `PENDING` status (useful after the worker was down or a bug is fixed) |
| `src/scripts/test-job-queue.ts` | Enqueue a single existing `RawJob` from the DB, for manual testing |

Everything else in `src/scripts/` was one-off debugging/exploration (Google provider diagnostics, embedding pipeline dry-runs, etc.) and lives in `src/scripts/debug/` to keep it separate from the operational scripts above. `npm run test:*`, `npm run scraper`, and `npm run worker` still work the same as before — only the on-disk paths moved.

## API Routes

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/health`                      | Health check             |
| POST   | `/api/v1/webhooks/clerk`       | Clerk webhook (raw body) |
| POST   | `/api/v1/resumes/upload`       | Upload & parse resume    |
| GET    | `/api/v1/resumes/:id`          | Get resume by ID         |
| PUT    | `/api/v1/resumes/:id`          | Update resume data       |
| POST   | `/api/v1/resumes/:id/finalize` | Generate embeddings (synchronous) |
| GET    | `/api/v1/scrapers/providers`   | List available scraper providers |
| POST   | `/api/v1/scrapers/:providerId/run` | Run a scraper, saving `RawJob`s and enqueueing them for processing |

## Scripts

```bash
npm run dev              # Dev server with watch
npm run build            # Compile TypeScript
npm run start            # Run compiled server (dist/server.js)
npm run worker           # Start the job-processing BullMQ worker (must be running for job scraping to work)
npm run cron             # ⚠️ Currently broken — src/scripts/scraper.scheduler.ts no longer exists
npm run typecheck        # Type-check without emit
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:generate  # Regenerate Prisma client
```

## Known Issues

- `npm run cron` points to `src/scripts/scraper.scheduler.ts`, which no longer exists — running it fails with `ERR_MODULE_NOT_FOUND`. The "weekly scheduler" is not implemented yet (scaffold sits unwired at `src/scheduler/weekly.scheduler.ts`); scraping must be triggered manually via the API.

The app now validates required env vars at startup (`src/config/env.ts`) and exits with a clear message listing what's missing, instead of failing later with an obscure error the first time an unset value is used.
