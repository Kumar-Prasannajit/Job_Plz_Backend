import { prisma } from "../config/database.js";

import { buildJobChunks } from "../modules/jobs/embeddings/jobChunker.js";

async function main() {
  const job = await prisma.job.findFirst();

  if (!job) {
    throw new Error("No jobs found");
  }

  const chunks = buildJobChunks(
    job.canonicalData as any,
  );

  console.dir(chunks, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });