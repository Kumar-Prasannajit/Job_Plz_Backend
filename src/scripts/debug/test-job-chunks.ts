import { db } from "../../db/client.js";
import { jobs } from "../../db/schema.js";

import { buildJobChunks } from "../../modules/jobs/embeddings/jobChunker.js";

async function main() {
  const [job] = await db.select().from(jobs).limit(1);

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
  .finally(() => process.exit(0));
