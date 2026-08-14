import { ollamaEmbeddingProvider } from "../../embeddings/ollama.provider.js";

import { buildJobChunks } from "./jobChunker.js";

import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";
import type { EmbeddedJobChunk } from "./jobEmbedding.types.js";

export class JobEmbeddingService {
  async generateEmbeddings(
    job: CanonicalJob,
  ): Promise<EmbeddedJobChunk[]> {
    const chunks = buildJobChunks(job);

    const embeddedChunks: EmbeddedJobChunk[] = [];

    for (const chunk of chunks) {
      const embedding =
        await ollamaEmbeddingProvider.generateEmbedding(
          chunk.content,
        );

      embeddedChunks.push({
        ...chunk,
        embedding,
      });
    }

    return embeddedChunks;
  }
}

export const jobEmbeddingService =
  new JobEmbeddingService();