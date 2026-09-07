// src/scripts/requeue-pending-jobs.ts

import { asc, eq } from "drizzle-orm";

import { db } from "../db/client.js";
import { rawJobs } from "../db/schema.js";
import { jobProcessingProducer } from "../queues/job-processing.producer.js";

async function main() {
  const pendingJobs = await db
    .select()
    .from(rawJobs)
    .where(eq(rawJobs.status, "PENDING"))
    .orderBy(asc(rawJobs.createdAt));

  console.log(
    `Found ${pendingJobs.length} pending job(s).`,
  );

  for (const job of pendingJobs) {
    await jobProcessingProducer.enqueue(job.id);

    console.log(
      `Queued: ${job.jobTitle}`,
    );
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
