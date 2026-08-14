import ollama from "ollama";

import type { EmbeddingProvider } from "./embedding.provider.js";
import type { ResumeChunk } from "./types.js";

export class OllamaEmbeddingProvider implements EmbeddingProvider {
  private readonly model = "nomic-embed-text";

  async generateEmbeddings(contents: string[]): Promise<number[][]> {
    if (contents.length === 0) {
      return [];
    }

    const embeddings: number[][] = [];

    for (const content of contents) {
      const response = await ollama.embeddings({
        model: this.model,
        prompt: content,
      });

      embeddings.push(response.embedding);
    }

    return embeddings;
  }

  async generateEmbedding(content: string): Promise<number[]> {
    const response = await ollama.embeddings({
      model: this.model,
      prompt: content,
    });

    return response.embedding;
  }
}

export const ollamaEmbeddingProvider = new OllamaEmbeddingProvider();
