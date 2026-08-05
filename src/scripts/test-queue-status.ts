import { jobProcessingQueue } from "../queues/job-processing.queue.js";

async function main() {
  console.log(await jobProcessingQueue.getJobCounts());

  const failed = await jobProcessingQueue.getFailed();

  console.log("\nFailed Jobs:");

  for (const job of failed) {
    console.log({
      id: job.id,
      name: job.name,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      stacktrace: job.stacktrace,
    });
  }

  process.exit(0);
}

main().catch(console.error);