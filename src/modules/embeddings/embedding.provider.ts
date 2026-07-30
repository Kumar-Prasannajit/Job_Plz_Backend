import type { ResumeChunk } from "./types.js";

export interface EmbeddingProvider {
  generateEmbeddings(chunks: ResumeChunk[]): Promise<number[][]>;
}