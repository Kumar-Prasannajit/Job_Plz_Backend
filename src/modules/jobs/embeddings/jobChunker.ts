import type { JobEmbeddingChunk } from "./jobEmbedding.types.js";

import { formatJob } from "../formatters/formatJob.js";
import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

export function buildJobChunks(
  job: CanonicalJob,
): JobEmbeddingChunk[] {
  const content = formatJob(job);

  return [
    {
      chunkIndex: 0,
      chunkType: "JOB_SUMMARY",
      content,
    },
  ];
}