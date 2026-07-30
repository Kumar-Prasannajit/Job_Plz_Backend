import type { ResumeChunk } from "./types.js";
import type { EmbeddingProvider } from "./embedding.provider.js";

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  async generateEmbeddings(
    chunks: ResumeChunk[],
  ): Promise<number[][]> {
    throw new Error("Not implemented.");
  }
}