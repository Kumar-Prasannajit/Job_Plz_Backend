import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/database.js";

export interface SimilarJobChunk {
  jobId: string;
  chunkType: string;
  chunkIndex: number;
  similarity: number;
}

class RecommendationRepository {
  async findSimilarJobChunks(
    embedding: number[],
    limitOrChunkTypes?: number | string[],
    maybeLimit = 20,
  ): Promise<SimilarJobChunk[]> {
    const vector = `[${embedding.join(",")}]`;

    const chunkTypes = Array.isArray(limitOrChunkTypes)
      ? limitOrChunkTypes
      : undefined;
    const limit = Array.isArray(limitOrChunkTypes)
      ? maybeLimit
      : limitOrChunkTypes ?? maybeLimit;

    if (!chunkTypes || chunkTypes.length === 0) {
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

    return prisma.$queryRaw<SimilarJobChunk[]>`
      SELECT
        "jobId",
        "chunkType",
        "chunkIndex",
        1 - (
          embedding <=> ${vector}::vector
        ) AS similarity
      FROM "job_embeddings"
      WHERE "chunkType" IN (
        ${Prisma.join(chunkTypes)}
      )
      ORDER BY embedding <=> ${vector}::vector
      LIMIT ${limit};
    `;
  }
}

export const recommendationRepository =
  new RecommendationRepository();