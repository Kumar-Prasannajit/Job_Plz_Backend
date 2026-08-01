-- CreateEnum
CREATE TYPE "RawJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "raw_jobs" (
    "id" TEXT NOT NULL,
    "jobUrl" TEXT NOT NULL,
    "platform" TEXT,
    "platformJobId" TEXT,
    "companyName" TEXT NOT NULL,
    "companyWebsite" TEXT,
    "companyLogoUrl" TEXT,
    "jobTitle" TEXT NOT NULL,
    "rawHtml" TEXT,
    "rawText" TEXT NOT NULL,
    "rawJson" JSONB,
    "location" TEXT,
    "status" "RawJobStatus" NOT NULL DEFAULT 'PENDING',
    "parserVersion" TEXT,
    "processedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "contentHash" TEXT NOT NULL,
    "metadata" JSONB,
    "scrapedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raw_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "raw_jobs_jobUrl_key" ON "raw_jobs"("jobUrl");

-- CreateIndex
CREATE UNIQUE INDEX "raw_jobs_contentHash_key" ON "raw_jobs"("contentHash");

-- CreateIndex
CREATE INDEX "raw_jobs_companyName_idx" ON "raw_jobs"("companyName");

-- CreateIndex
CREATE INDEX "raw_jobs_jobTitle_idx" ON "raw_jobs"("jobTitle");

-- CreateIndex
CREATE INDEX "raw_jobs_status_idx" ON "raw_jobs"("status");

-- CreateIndex
CREATE INDEX "raw_jobs_scrapedAt_idx" ON "raw_jobs"("scrapedAt");
