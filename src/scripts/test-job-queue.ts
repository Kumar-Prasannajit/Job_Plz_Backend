import { db } from "../db/client.js";
import { rawJobs } from "../db/schema.js";

import { jobProcessingProducer } from "../queues/job-processing.producer.js";

async function main() {
  const [rawJob] = await db.select().from(rawJobs).limit(1);

  if (!rawJob) {
    throw new Error("No RawJob found.");
  }

  console.log("Queueing:");
  console.log(rawJob.id);
  console.log(rawJob.jobTitle);

  await jobProcessingProducer.enqueue(rawJob.id);

  console.log("✅ Job queued successfully.");
}

main()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });
