// src/scripts/requeue-pending-jobs.ts

import { prisma } from "../config/database.js";
import { jobProcessingProducer } from "../queues/job-processing.producer.js";

async function main() {
  const pendingJobs = await prisma.rawJob.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

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