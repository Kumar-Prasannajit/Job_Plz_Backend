// src/scripts/test-google-sections-50.ts

import { prisma } from "../config/database.js";
import { googleSectionExtractor } from "../modules/scraper/providers/google/googleSectionExtractor.js";

async function main() {
  const jobs = await prisma.rawJob.findMany({
    where: {
      platform: "Google Careers",
    },
    orderBy: {
      scrapedAt: "desc",
    },
    take: 50,
  });

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

  await prisma.$disconnect();
}

main().catch(console.error);