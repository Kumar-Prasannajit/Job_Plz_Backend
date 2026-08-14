import type { CanonicalResume } from "../resumes/schemas/canonicalResume.schema.js";

import { formatResume } from "../embeddings/formatter/resumeFormatter.js";
import { ollamaEmbeddingProvider } from "./ollama.provider.js";

import type { ResumeChunk } from "./types.js";

export class EmbeddingService {
  private readonly provider =
    ollamaEmbeddingProvider;

  public format(
    resume: CanonicalResume,
  ): ResumeChunk[] {
    return formatResume(resume);
  }

  public async generateEmbeddings(
    chunks: ResumeChunk[],
  ): Promise<number[][]> {
    return this.provider.generateEmbeddings(
      chunks.map(
        (chunk) => chunk.chunkContent,
      ),
    );
  }
}

export const embeddingService =
  new EmbeddingService();