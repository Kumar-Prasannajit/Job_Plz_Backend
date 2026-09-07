import { eq } from "drizzle-orm";

import { db } from "../../../db/client.js";
import { jobEmbeddings } from "../../../db/schema.js";

import type { EmbeddedJobChunk } from "./jobEmbedding.types.js";

class JobEmbeddingRepository {
  async replaceEmbeddings(
    jobId: string,
    chunks: EmbeddedJobChunk[],
  ): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(jobEmbeddings).where(eq(jobEmbeddings.jobId, jobId));

      const rows = chunks.map((chunk) => ({
        jobId,
        chunkType: chunk.chunkType,
        chunkIndex: chunk.chunkIndex,
        chunkContent: chunk.content,
        embedding: chunk.embedding,
        metadata: null,
      }));

      if (rows.length > 0) {
        await tx.insert(jobEmbeddings).values(rows);
      }

      console.log(`Saved ${chunks.length} embeddings for job ${jobId}`);
    });
  }
}

export const jobEmbeddingRepository = new JobEmbeddingRepository();
