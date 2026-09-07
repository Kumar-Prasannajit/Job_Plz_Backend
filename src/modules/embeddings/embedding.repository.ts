import { eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { resumeEmbeddings } from "../../db/schema.js";

import type { ResumeChunk } from "./types.js";

class EmbeddingRepository {
  async replaceEmbeddings(
    resumeId: string,
    chunks: ResumeChunk[],
    embeddings: number[][],
  ): Promise<void> {
    if (chunks.length !== embeddings.length) {
      throw new Error("Chunks and embeddings count do not match.");
    }

    await db.transaction(async (tx) => {
      // Delete old embeddings
      await tx
        .delete(resumeEmbeddings)
        .where(eq(resumeEmbeddings.resumeId, resumeId));

      // Insert new embeddings
      const rows = chunks.map((chunk, index) => {
        const embedding = embeddings.at(index);

        if (!embedding) {
          throw new Error(`Missing embedding for chunk ${index}`);
        }

        return {
          resumeId,
          chunkType: chunk.chunkType,
          chunkIndex: chunk.chunkIndex,
          chunkContent: chunk.chunkContent,
          embedding,
          metadata: chunk.metadata ?? null,
        };
      });

      if (rows.length > 0) {
        await tx.insert(resumeEmbeddings).values(rows);
      }

      console.log(`Saved ${chunks.length} embeddings for resume ${resumeId}`);
    });
  }

  async findByResumeId(resumeId: string) {
    return db
      .select({
        chunkIndex: resumeEmbeddings.chunkIndex,
        chunkType: resumeEmbeddings.chunkType,
        chunkContent: resumeEmbeddings.chunkContent,
        embedding: resumeEmbeddings.embedding,
      })
      .from(resumeEmbeddings)
      .where(eq(resumeEmbeddings.resumeId, resumeId))
      .orderBy(resumeEmbeddings.chunkIndex);
  }
}

export const embeddingRepository = new EmbeddingRepository();
