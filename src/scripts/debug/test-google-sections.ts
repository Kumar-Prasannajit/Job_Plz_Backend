// src/scripts/test-google-sections.ts

import { desc, eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { rawJobs } from "../../db/schema.js";
import { googleSectionExtractor } from "../../modules/scraper/providers/google/googleSectionExtractor.js";

async function main() {
  const [rawJob] = await db
    .select()
    .from(rawJobs)
    .where(eq(rawJobs.platform, "Google Careers"))
    .orderBy(desc(rawJobs.scrapedAt))
    .limit(1);

  if (!rawJob) {
    console.log("❌ No Google job found");
    return;
  }

  console.log("");
  console.log("====================================");
  console.log("RAW JOB");
  console.log("====================================");

  console.log("Title:", rawJob.jobTitle);
  console.log("URL:", rawJob.jobUrl);

  console.log("");
  console.log("====================================");
  console.log("EXTRACTED SECTIONS");
  console.log("====================================");

  const sections = googleSectionExtractor.extract(
    rawJob.rawText,
  );

  console.dir(sections, {
    depth: null,
    colors: true,
  });

  console.log("");
  console.log("====================================");
  console.log("SUMMARY");
  console.log("====================================");

  console.table({
    title: sections.title,
    location: sections.location,
    level: sections.level,

    minimumQualifications:
      sections.minimumQualifications?.length ?? 0,

    preferredQualifications:
      sections.preferredQualifications?.length ?? 0,

    responsibilities:
      sections.responsibilities?.length ?? 0,

    aboutLength:
      sections.about?.length ?? 0,
  });

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
