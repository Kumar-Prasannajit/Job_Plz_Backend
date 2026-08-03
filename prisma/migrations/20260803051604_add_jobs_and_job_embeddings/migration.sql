-- CreateEnum
CREATE TYPE "JobChunkType" AS ENUM ('JOB_SUMMARY', 'REQUIREMENTS', 'SKILLS', 'RESPONSIBILITIES');

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "rawJobId" TEXT NOT NULL,
    "canonicalData" JSONB NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_embeddings" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "chunkType" "JobChunkType" NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "chunkContent" TEXT NOT NULL,
    "embedding" vector(3072) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_rawJobId_key" ON "jobs"("rawJobId");

-- CreateIndex
CREATE INDEX "jobs_schemaVersion_idx" ON "jobs"("schemaVersion");

-- CreateIndex
CREATE INDEX "job_embeddings_jobId_idx" ON "job_embeddings"("jobId");

-- CreateIndex
CREATE INDEX "job_embeddings_chunkType_idx" ON "job_embeddings"("chunkType");

-- CreateIndex
CREATE UNIQUE INDEX "job_embeddings_jobId_chunkIndex_key" ON "job_embeddings"("jobId", "chunkIndex");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_rawJobId_fkey" FOREIGN KEY ("rawJobId") REFERENCES "raw_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_embeddings" ADD CONSTRAINT "job_embeddings_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
