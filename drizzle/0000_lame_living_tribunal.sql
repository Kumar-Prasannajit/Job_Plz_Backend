CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE TYPE "public"."ChunkType" AS ENUM('SUMMARY', 'SKILLS', 'EXPERIENCE', 'PROJECT', 'EDUCATION', 'CERTIFICATION', 'ACHIEVEMENT', 'LANGUAGE');--> statement-breakpoint
CREATE TYPE "public"."JobChunkType" AS ENUM('JOB_SUMMARY', 'REQUIREMENTS', 'SKILLS', 'RESPONSIBILITIES');--> statement-breakpoint
CREATE TYPE "public"."RawJobStatus" AS ENUM('PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."UserRole" AS ENUM('USER', 'RECRUITER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "job_embeddings" (
	"id" text PRIMARY KEY NOT NULL,
	"jobId" text NOT NULL,
	"chunkType" "JobChunkType" NOT NULL,
	"chunkIndex" integer NOT NULL,
	"chunkContent" text NOT NULL,
	"embedding" vector(768) NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"rawJobId" text NOT NULL,
	"canonicalData" jsonb NOT NULL,
	"schemaVersion" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "raw_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"jobUrl" text NOT NULL,
	"platform" text,
	"platformJobId" text,
	"companyName" text NOT NULL,
	"companyWebsite" text,
	"companyLogoUrl" text,
	"jobTitle" text NOT NULL,
	"rawHtml" text,
	"rawText" text NOT NULL,
	"rawJson" jsonb,
	"location" text,
	"status" "RawJobStatus" DEFAULT 'PENDING' NOT NULL,
	"parserVersion" text,
	"processedAt" timestamp (3),
	"failureReason" text,
	"contentHash" text NOT NULL,
	"metadata" jsonb,
	"scrapedAt" timestamp (3) NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_embeddings" (
	"id" text PRIMARY KEY NOT NULL,
	"resumeId" text NOT NULL,
	"chunkType" "ChunkType" NOT NULL,
	"chunkIndex" integer NOT NULL,
	"chunkContent" text NOT NULL,
	"embedding" vector(768) NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"originalFileName" text NOT NULL,
	"cloudinaryUrl" text NOT NULL,
	"cloudinaryId" text NOT NULL,
	"parsedData" jsonb,
	"parserVersion" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"clerkUserId" text NOT NULL,
	"email" text NOT NULL,
	"firstName" text,
	"lastName" text,
	"imageUrl" text,
	"role" "UserRole" DEFAULT 'USER' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_embeddings" ADD CONSTRAINT "job_embeddings_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_rawJobId_fkey" FOREIGN KEY ("rawJobId") REFERENCES "public"."raw_jobs"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resume_embeddings" ADD CONSTRAINT "resume_embeddings_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "job_embeddings_jobId_chunkIndex_key" ON "job_embeddings" USING btree ("jobId","chunkIndex");--> statement-breakpoint
CREATE INDEX "job_embeddings_jobId_idx" ON "job_embeddings" USING btree ("jobId");--> statement-breakpoint
CREATE INDEX "job_embeddings_chunkType_idx" ON "job_embeddings" USING btree ("chunkType");--> statement-breakpoint
CREATE UNIQUE INDEX "jobs_rawJobId_key" ON "jobs" USING btree ("rawJobId");--> statement-breakpoint
CREATE INDEX "jobs_schemaVersion_idx" ON "jobs" USING btree ("schemaVersion");--> statement-breakpoint
CREATE UNIQUE INDEX "raw_jobs_jobUrl_key" ON "raw_jobs" USING btree ("jobUrl");--> statement-breakpoint
CREATE UNIQUE INDEX "raw_jobs_contentHash_key" ON "raw_jobs" USING btree ("contentHash");--> statement-breakpoint
CREATE INDEX "raw_jobs_companyName_idx" ON "raw_jobs" USING btree ("companyName");--> statement-breakpoint
CREATE INDEX "raw_jobs_jobTitle_idx" ON "raw_jobs" USING btree ("jobTitle");--> statement-breakpoint
CREATE INDEX "raw_jobs_status_idx" ON "raw_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "raw_jobs_scrapedAt_idx" ON "raw_jobs" USING btree ("scrapedAt");--> statement-breakpoint
CREATE UNIQUE INDEX "resume_embeddings_resumeId_chunkIndex_key" ON "resume_embeddings" USING btree ("resumeId","chunkIndex");--> statement-breakpoint
CREATE INDEX "resume_embeddings_resumeId_idx" ON "resume_embeddings" USING btree ("resumeId");--> statement-breakpoint
CREATE INDEX "resume_embeddings_chunkType_idx" ON "resume_embeddings" USING btree ("chunkType");--> statement-breakpoint
CREATE UNIQUE INDEX "users_clerkUserId_key" ON "users" USING btree ("clerkUserId");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email");