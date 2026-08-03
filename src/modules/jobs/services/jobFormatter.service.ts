import { buildJobChunks } from "../embeddings/jobChunker.js";

import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";
import type { JobEmbeddingChunk } from "../embeddings/jobEmbedding.types.js";

class JobFormatterService {
  format(
    job: CanonicalJob,
  ): JobEmbeddingChunk[] {
    return buildJobChunks(job);
  }
}

export const jobFormatterService =
  new JobFormatterService();