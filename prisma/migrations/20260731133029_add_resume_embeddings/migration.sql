CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "ChunkType" AS ENUM ('SUMMARY', 'SKILLS', 'EXPERIENCE', 'PROJECT', 'EDUCATION', 'CERTIFICATION', 'ACHIEVEMENT', 'LANGUAGE');

-- CreateTable
CREATE TABLE "resume_embeddings" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "chunkType" "ChunkType" NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "chunkContent" TEXT NOT NULL,
    "embedding" vector(3072) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resume_embeddings_resumeId_idx" ON "resume_embeddings"("resumeId");

-- CreateIndex
CREATE INDEX "resume_embeddings_chunkType_idx" ON "resume_embeddings"("chunkType");

-- CreateIndex
CREATE UNIQUE INDEX "resume_embeddings_resumeId_chunkIndex_key" ON "resume_embeddings"("resumeId", "chunkIndex");

-- AddForeignKey
ALTER TABLE "resume_embeddings" ADD CONSTRAINT "resume_embeddings_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
