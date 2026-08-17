import { prisma } from "../config/database.js";

import { recommendationRepository } from "../modules/recomendation/repositories/recommendation.repository.js";

async function main() {
  const chunks = await prisma.$queryRaw<
    {
      embedding: string;
    }[]
  >`
    SELECT embedding::text AS embedding
    FROM "resume_embeddings"
    ORDER BY "chunkIndex"
    LIMIT 1;
  `;

  const firstChunk = chunks[0];

  if (!firstChunk) {
    throw new Error(
      "No resume embeddings found.",
    );
  }

  const embedding = JSON.parse(
    firstChunk.embedding,
  ) as number[];

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
  .finally(async () => {
    await prisma.$disconnect();
  });