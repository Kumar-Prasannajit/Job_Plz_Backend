import { createId } from "@paralleldrive/cuid2";

import { prisma } from "../../../config/database.js";

import type { EmbeddedJobChunk } from "./jobEmbedding.types.js";

class JobEmbeddingRepository {
  async replaceEmbeddings(
    jobId: string,
    chunks: EmbeddedJobChunk[],
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        DELETE FROM "job_embeddings"
        WHERE "jobId" = ${jobId};
      `;

      for (const chunk of chunks) {
        const vector = `[${chunk.embedding.join(",")}]`;
        const metadata = JSON.stringify(null);

        await tx.$executeRawUnsafe(
          `
INSERT INTO "job_embeddings"
(
  "id",
  "jobId",
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
  $3::"JobChunkType",
  $4,
  $5,
  $6::vector,
  $7::jsonb,
  NOW(),
  NOW()
)
`,
          createId(),
          jobId,
          chunk.chunkType,
          chunk.chunkIndex,
          chunk.content,
          vector,
          metadata,
        );
      }

      console.log(
        `Saved ${chunks.length} embeddings for job ${jobId}`,
      );
    });
  }
}

export const jobEmbeddingRepository =
  new JobEmbeddingRepository();