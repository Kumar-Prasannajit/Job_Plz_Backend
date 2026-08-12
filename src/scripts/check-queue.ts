// src/scripts/check-queue.ts

import { Queue } from "bullmq";
import { queueConnection } from "../queues/index.js";

const queue = new Queue(
  "job-processing",
  {
    connection: queueConnection,
  },
);

async function main() {
  const counts =
    await queue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
      "paused",
    );

  console.log(counts);

  process.exit(0);
}

main();