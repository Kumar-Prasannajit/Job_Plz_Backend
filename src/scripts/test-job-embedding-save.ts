// src/scripts/test-job-embedding-save.ts

import { prisma } from "../config/database.js";

import { buildJobChunks } from "../modules/jobs/embeddings/jobChunker.js";
import { jobEmbeddingService } from "../modules/jobs/embeddings/jobEmbedding.service.js";
import { jobEmbeddingRepository } from "../modules/jobs/embeddings/jobEmbedding.repository.js";

import type { CanonicalJob } from "../modules/jobs/schemas/canonicalJob.schema.js";

async function main() {
  const job = await prisma.job.findFirst();

  if (!job) {
    throw new Error("No jobs found");
  }

  const canonicalJob =
    job.canonicalData as CanonicalJob;

  const embeddings =
    await jobEmbeddingService.generateEmbeddings(
      canonicalJob,
    );

  await jobEmbeddingRepository.replaceEmbeddings(
    job.id,
    embeddings,
  );

  const saved =
    await prisma.jobEmbedding.findMany({
      where: {
        jobId: job.id,
      },
      orderBy: {
        chunkIndex: "asc",
      },
    });

  console.log(
    "Saved embeddings:",
    saved.length,
  );

  for (const chunk of saved) {
    console.log(
      chunk.chunkIndex,
      chunk.chunkType,
    );
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });