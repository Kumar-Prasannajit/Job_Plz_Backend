import { createId } from "@paralleldrive/cuid2";
import { prisma } from "../../config/database.js";
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

    await prisma.$transaction(async (tx) => {
      // Delete old embeddings
      await tx.$executeRaw`
        DELETE FROM "resume_embeddings"
        WHERE "resumeId" = ${resumeId};
      `;

      // Insert new embeddings
      for (const [index, chunk] of chunks.entries()) {
        const embedding = embeddings.at(index);

        if (!embedding) {
          throw new Error(`Missing embedding for chunk ${index}`);
        }

        const vector = `[${embedding.join(",")}]`;
        const metadata = JSON.stringify(chunk.metadata ?? null);

        await tx.$executeRawUnsafe(
          `
  INSERT INTO "resume_embeddings"
  (
    "id",
    "resumeId",
    "chunkType",
    "chunkIndex",
    "chunkContent",
    "embedding",
    "metadata",
    "createdAt",
    "updatedAt"
  )
  VALUES
  (
    $1,
    $2,
    $3::"ChunkType",
    $4,
    $5,
    $6::vector,
    $7::jsonb,
    NOW(),
    NOW()
  )
  `,
          createId(),
          resumeId,
          chunk.chunkType,
          chunk.chunkIndex,
          chunk.chunkContent,
          vector,
          metadata,
        );
      }
      console.log(`Saved ${chunks.length} embeddings for resume ${resumeId}`);
    });
  }
}

export const embeddingRepository = new EmbeddingRepository();
