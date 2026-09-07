// src/scripts/test-job-embedding-save.ts

import { asc, eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { jobs, jobEmbeddings } from "../../db/schema.js";

import { jobEmbeddingService } from "../../modules/jobs/embeddings/jobEmbedding.service.js";
import { jobEmbeddingRepository } from "../../modules/jobs/embeddings/jobEmbedding.repository.js";

import type { CanonicalJob } from "../../modules/jobs/schemas/canonicalJob.schema.js";

async function main() {
  const [job] = await db.select().from(jobs).limit(1);

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

  const saved = await db
    .select()
    .from(jobEmbeddings)
    .where(eq(jobEmbeddings.jobId, job.id))
    .orderBy(asc(jobEmbeddings.chunkIndex));

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
  .finally(() => process.exit(0));
