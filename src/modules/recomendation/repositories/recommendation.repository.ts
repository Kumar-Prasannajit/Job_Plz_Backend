import { prisma } from "../../../config/database.js";

export interface SimilarJobChunk {
  jobId: string;
  chunkType: string;
  similarity: number;
}

class RecommendationRepository {
  async findSimilarJobChunks(
    embedding: number[],
    limit = 20,
  ): Promise<SimilarJobChunk[]> {
    const vector = `[${embedding.join(",")}]`;

    return prisma.$queryRaw<SimilarJobChunk[]>`
      SELECT
        "jobId",
        "chunkType",
        1 - (
          embedding <=> ${vector}::vector
        ) AS similarity
      FROM "job_embeddings"
      ORDER BY embedding <=> ${vector}::vector
      LIMIT ${limit};
    `;
  }
}

export const recommendationRepository =
  new RecommendationRepository();