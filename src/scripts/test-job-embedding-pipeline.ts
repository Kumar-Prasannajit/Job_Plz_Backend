// src/scripts/test-job-embedding-pipeline.ts

import { prisma } from "../config/database.js";

import { buildJobChunks } from "../modules/jobs/embeddings/jobChunker.js";
import { jobEmbeddingService } from "../modules/jobs/embeddings/jobEmbedding.service.js";

import type { CanonicalJob } from "../modules/jobs/schemas/canonicalJob.schema.js";

async function main() {
  console.log("\n=================================");
  console.log("FETCHING JOB");
  console.log("=================================\n");

  const job = await prisma.job.findFirst();

  if (!job) {
    throw new Error("No jobs found");
  }

  const canonicalJob =
    job.canonicalData as CanonicalJob;

  console.log("Job ID:", job.id);

  console.log("\n=================================");
  console.log("BUILDING CHUNKS");
  console.log("=================================\n");

  const chunks =
    buildJobChunks(canonicalJob);

  console.log(`Chunks Created: ${chunks.length}\n`);

  for (const chunk of chunks) {
    console.log("---------------------------------");
    console.log("Type:", chunk.chunkType);
    console.log("Index:", chunk.chunkIndex);
    console.log(
      "Content Length:",
      chunk.content.length,
    );
    console.log("---------------------------------\n");
  }

  console.log("\n=================================");
  console.log("GENERATING EMBEDDINGS");
  console.log("=================================\n");

  const embeddings =
    await jobEmbeddingService.generateEmbeddings(
      canonicalJob,
    );

  console.log(
    `Generated ${embeddings.length} embeddings\n`,
  );

  for (const embedding of embeddings) {
    console.log("---------------------------------");
    console.log("Type:", embedding.chunkType);
    console.log(
      "Dimension:",
      embedding.embedding.length,
    );
    console.log("---------------------------------\n");
  }

  console.log("\n=================================");
  console.log("SUCCESS");
  console.log("=================================\n");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });