import { Worker } from "bullmq";

import { prisma } from "../config/database.js";

import { queueConnection } from "../queues/index.js";

import { jobRepository } from "../modules/jobs/repositories/job.repository.js";
import { jobService } from "../modules/jobs/services/job.service.js";
import { JobProcessingError } from "../modules/jobs/errors/jobProcessing.error.js";

import { rawJobRepository } from "../modules/scraper/repositories/rawJob.repository.js";

export const jobProcessingWorker = new Worker(
  "job-processing",
  async (job) => {
    console.log("");
    console.log("========================================");
    console.log(`📨 Processing Queue Job: ${job.id}`);
    console.log("========================================");

    const rawJob = await prisma.rawJob.findUnique({
      where: {
        id: job.data.rawJobId,
      },
    });

    if (!rawJob) {
      throw new Error(
        `RawJob ${job.data.rawJobId} not found.`,
      );
    }

    const existingJob =
      await jobRepository.findByRawJobId(
        rawJob.id,
      );

    if (existingJob) {
      console.log(
        "⏭️ Canonical job already exists. Skipping processing.",
      );

      console.log(
        `✅ Queue Job Completed: ${job.id}`,
      );

      return;
    }

    await rawJobRepository.markProcessing(
      rawJob.id,
    );

    try {
      await jobService.process(rawJob);

      await rawJobRepository.markCompleted(
        rawJob.id,
      );

      console.log(
        "✅ Job processed successfully.",
      );

      console.log(
        `✅ Queue Job Completed: ${job.id}`,
      );
    } catch (error) {
      const reason =
        error instanceof Error
          ? error.message
          : "Unknown error";

      await rawJobRepository.markFailed(
        rawJob.id,
        reason,
      );

      if (
        JobProcessingError.isRetryable(error)
      ) {
        console.log(
          "🔁 Retryable error. BullMQ will retry.",
        );

        throw error;
      }

      console.log(
        "⛔ Non-retryable error. Marking job as failed.",
      );

      return;
    }
  },
  {
    connection: queueConnection,
  },
);

jobProcessingWorker.on(
  "completed",
  (job) => {
    console.log(`🎉 Completed: ${job.id}`);
  },
);

jobProcessingWorker.on(
  "failed",
  (job, error) => {
    console.error(
      `❌ Failed: ${job?.id}`,
    );

    console.error(error);
  },
);

console.log(
  "🚀 Job Processing Worker Started",
);