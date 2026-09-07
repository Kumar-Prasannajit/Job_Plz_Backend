// src/scripts/test-google-sections-50.ts

import { desc, eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { rawJobs } from "../../db/schema.js";
import { googleSectionExtractor } from "../../modules/scraper/providers/google/googleSectionExtractor.js";

async function main() {
  const jobs = await db
    .select()
    .from(rawJobs)
    .where(eq(rawJobs.platform, "Google Careers"))
    .orderBy(desc(rawJobs.scrapedAt))
    .limit(50);

  console.log(`Testing ${jobs.length} jobs...\n`);

  let passed = 0;

  for (const [index, job] of jobs.entries()) {
    try {
      const sections =
        googleSectionExtractor.extract(
          job.rawText,
        );

      const valid =
        sections.title &&
        sections.location &&
        sections.minimumQualifications.length > 0 &&
        sections.responsibilities.length > 0;

      console.log(
        `[${index + 1}/50] ${
          valid ? "✅" : "❌"
        } ${job.jobTitle}`,
      );

      if (valid) passed++;
    } catch (error) {
      console.log(
        `[${index + 1}/50] ❌ ${job.jobTitle}`,
      );

      console.error(error);
    }
  }

  console.log("\n====================================");
  console.log("FINAL RESULT");
  console.log("====================================");

  console.log(`Passed: ${passed}/${jobs.length}`);

  console.log(
    `Success Rate: ${(
      (passed / jobs.length) *
      100
    ).toFixed(2)}%`,
  );

  process.exit(0);
}

main().catch(console.error);
