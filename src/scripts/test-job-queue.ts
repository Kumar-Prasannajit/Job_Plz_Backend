import { prisma } from "../config/database.js";

import { jobProcessingProducer } from "../queues/job-processing.producer.js";

async function main() {
  const rawJob = await prisma.rawJob.findFirst();

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
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });