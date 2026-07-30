import type { CanonicalResume } from "../resumes/schemas/canonicalResume.schema.js";

import { formatResume } from "../embeddings/formatter/resumeFormatter.js";
import { GeminiEmbeddingProvider } from "./gemini.provider.js";
import type { ResumeChunk } from "./types.js";

export class EmbeddingService {
  private readonly provider = new GeminiEmbeddingProvider();

  public format(
    resume: CanonicalResume,
  ): ResumeChunk[] {
    return formatResume(resume);
  }

  public async generateEmbeddings(
    chunks: ResumeChunk[],
  ): Promise<number[][]> {
    return this.provider.generateEmbeddings(chunks);
  }
}