# JobPlz Backend

AI-powered job suggestion backend that parses resumes, generates embeddings, and recommends matching jobs.

> **Under Development** — Core features are working: authentication, resume upload with AI-powered extraction, Zod validation, and embedding generation pipeline.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM + pgvector
- **Auth:** Clerk (webhooks + JWT middleware)
- **AI:** Google Gemini (resume extraction + embeddings)
- **Storage:** Cloudinary (resume PDFs)
- **Queue:** BullMQ + Redis (background jobs)
- **Validation:** Zod

## Features

- **Authentication** — Clerk-based auth with webhook sync for user creation
- **Resume Upload** — PDF upload → Cloudinary storage → text parsing → AI extraction
- **Canonical Resume Schema** — Structured resume data (skills, experience, education, projects, etc.)
- **Zod Validation** — End-to-end validation for all request payloads and resume schemas
- **AI Embedding Pipeline** — Resume chunking → Gemini embedding generation → pgvector storage (3072 dimensions)
- **Job Scraper** — Google Jobs provider with raw job ingestion and processing queue
- **Weekly Scheduler** — Scheduled job scraping via BullMQ

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

# Start development server
npm run dev
```

## API Routes

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/health`                     | Health check             |
| POST   | `/api/v1/webhooks/clerk`      | Clerk webhook (raw body) |
| POST   | `/api/v1/resumes/upload`      | Upload & parse resume    |
| GET    | `/api/v1/resumes/:id`         | Get resume by ID         |
| PUT    | `/api/v1/resumes/:id`         | Update resume data       |
| POST   | `/api/v1/resumes/:id/finalize`| Generate embeddings      |

## Scripts

```bash
npm run dev              # Dev server with watch
npm run build            # Compile TypeScript
npm run typecheck        # Type-check without emit
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:generate  # Regenerate Prisma client
```
