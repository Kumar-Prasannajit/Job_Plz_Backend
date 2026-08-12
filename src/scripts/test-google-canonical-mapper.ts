import { prisma } from "../config/database.js";

import { googleSectionExtractor } from "../modules/scraper/providers/google/googleSectionExtractor.js";
import { googleCanonicalMapper } from "../modules/scraper/providers/google/googleCanonicalMapper.js";

async function main() {
  const rawJob = await prisma.rawJob.findFirst({
    where: {
      platform: "Google Careers",
    },
    orderBy: {
      scrapedAt: "desc",
    },
  });

  if (!rawJob) {
    console.log("No Google job found");
    return;
  }

  const sections =
    googleSectionExtractor.extract(
      rawJob.rawText,
    );

  const canonicalJob =
    googleCanonicalMapper.toCanonicalJob(
      sections,
      rawJob
    );

  console.dir(
    canonicalJob,
    { depth: null },
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());