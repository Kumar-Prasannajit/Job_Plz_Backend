import { Queue } from "bullmq";

import { queueConnection } from "./index.js";

export interface JobProcessingPayload {
  rawJobId: string;
}

export const jobProcessingQueue =
  new Queue<JobProcessingPayload>(
    "job-processing",
    {
      connection: queueConnection,
      defaultJobOptions: {
        removeOnComplete: 1000,
        removeOnFail: 5000,

        attempts: 3,

        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
    },
  );