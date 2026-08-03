import { GoogleGenAI } from "@google/genai";

import { env } from "../../config/env.js";

import type { EmbeddingProvider } from "./embedding.provider.js";
import type { ResumeChunk } from "./types.js";

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  async generateEmbeddings(
    chunks: ResumeChunk[],
  ): Promise<number[][]> {
    if (chunks.length === 0) {
      return [];
    }

    const response = await this.client.models.embedContent({
      model: "gemini-embedding-001",
      contents: chunks.map((chunk) => chunk.chunkContent),
    });

    return (
      response.embeddings?.map((embedding) => {
        if (!embedding.values) {
          throw new Error("Gemini returned an empty embedding.");
        }

        return embedding.values;
      }) ?? []
    );
  }

  async generateEmbedding(
    content: string,
  ): Promise<number[]> {
    const response = await this.client.models.embedContent({
      model: "gemini-embedding-001",
      contents: [content],
    });

    const embedding = response.embeddings?.[0];

    if (!embedding?.values) {
      throw new Error("Gemini returned an empty embedding.");
    }

    return embedding.values;
  }
}

export const geminiEmbeddingProvider =
  new GeminiEmbeddingProvider();