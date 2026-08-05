import { jobProcessingQueue } from "./job-processing.queue.js";

class JobProcessingProducer {
  async enqueue(
    rawJobId: string,
  ): Promise<void> {
    await jobProcessingQueue.add(
      "process-job",
      {
        rawJobId,
      },
      {
        jobId: rawJobId,
      },
    );
  }
}

export const jobProcessingProducer =
  new JobProcessingProducer();