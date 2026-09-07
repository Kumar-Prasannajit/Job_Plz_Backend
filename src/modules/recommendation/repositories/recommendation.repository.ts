import { asc, inArray, sql } from "drizzle-orm";

import { db } from "../../../db/client.js";
import { jobEmbeddings, jobChunkType } from "../../../db/schema.js";

export interface SimilarJobChunk {
  jobId: string;
  chunkType: string;
  chunkIndex: number;
  similarity: number;
}

type JobChunkTypeValue = (typeof jobChunkType.enumValues)[number];

class RecommendationRepository {
  async findSimilarJobChunks(
    embedding: number[],
    limitOrChunkTypes?: number | string[],
    maybeLimit = 20,
  ): Promise<SimilarJobChunk[]> {
    const chunkTypes = Array.isArray(limitOrChunkTypes)
      ? limitOrChunkTypes
      : undefined;
    const limit = Array.isArray(limitOrChunkTypes)
      ? maybeLimit
      : (limitOrChunkTypes ?? maybeLimit);

    // Explicit ::vector cast, same as the previous raw SQL — without it, the
    // bound parameter has no declared type and Postgres can fail to resolve
    // the <=> operator against the vector column.
    const vectorLiteral = `[${embedding.join(",")}]`;
    const distance = sql<number>`${jobEmbeddings.embedding} <=> ${vectorLiteral}::vector`;

    return db
      .select({
        jobId: jobEmbeddings.jobId,
        chunkType: jobEmbeddings.chunkType,
        chunkIndex: jobEmbeddings.chunkIndex,
        similarity: sql<number>`1 - (${distance})`,
      })
      .from(jobEmbeddings)
      .where(
        chunkTypes && chunkTypes.length > 0
          ? inArray(jobEmbeddings.chunkType, chunkTypes as JobChunkTypeValue[])
          : undefined,
      )
      .orderBy(asc(distance))
      .limit(limit);
  }
}

export const recommendationRepository = new RecommendationRepository();
