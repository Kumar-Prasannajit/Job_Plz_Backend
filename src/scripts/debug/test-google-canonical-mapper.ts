import { desc, eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { rawJobs } from "../../db/schema.js";

import { googleSectionExtractor } from "../../modules/scraper/providers/google/googleSectionExtractor.js";
import { googleCanonicalMapper } from "../../modules/scraper/providers/google/googleCanonicalMapper.js";

async function main() {
  const [rawJob] = await db
    .select()
    .from(rawJobs)
    .where(eq(rawJobs.platform, "Google Careers"))
    .orderBy(desc(rawJobs.scrapedAt))
    .limit(1);

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
  .finally(() => process.exit(0));
