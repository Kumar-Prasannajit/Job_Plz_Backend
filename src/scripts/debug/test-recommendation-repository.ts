import { asc } from "drizzle-orm";

import { db } from "../../db/client.js";
import { resumeEmbeddings } from "../../db/schema.js";

import { recommendationRepository } from "../../modules/recommendation/repositories/recommendation.repository.js";

async function main() {
  const [firstChunk] = await db
    .select({ embedding: resumeEmbeddings.embedding })
    .from(resumeEmbeddings)
    .orderBy(asc(resumeEmbeddings.chunkIndex))
    .limit(1);

  if (!firstChunk) {
    throw new Error(
      "No resume embeddings found.",
    );
  }

  const embedding = firstChunk.embedding;

  console.log(
    `Loaded embedding (${embedding.length} dimensions)`,
  );

  const results =
    await recommendationRepository.findSimilarJobChunks(
      embedding,
      10,
    );

  console.table(results);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
