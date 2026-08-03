import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

export interface ProcessJobResult {
  jobId: string;

  canonicalJob: CanonicalJob;

  embeddingChunks: number;
}