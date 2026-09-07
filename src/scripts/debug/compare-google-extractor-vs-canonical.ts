import { desc } from "drizzle-orm";

import { db } from "../../db/client.js";
import { jobs } from "../../db/schema.js";
import { googleSectionExtractor } from "../../modules/scraper/providers/google/googleSectionExtractor.js";

function normalize(value: unknown) {
  if (!value) return "";

  return String(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const jobRows = await db.query.jobs.findMany({
    orderBy: desc(jobs.createdAt),
    limit: 50,
    with: {
      rawJob: true,
    },
  });

  console.log(`Testing ${jobRows.length} jobs...\n`);

  let titleMatches = 0;
  let locationMatches = 0;
  let levelMatches = 0;

  for (const [index, job] of jobRows.entries()) {
    const canonical = job.canonicalData as any;

    const extracted =
      googleSectionExtractor.extract(
        job.rawJob.rawText,
      );

    const score = {
      title:
        normalize(extracted.title) ===
        normalize(canonical?.job?.title),

      location:
        normalize(extracted.location) ===
        normalize(canonical?.job?.location),

      level:
        normalize(extracted.level) ===
        normalize(canonical?.job?.jobLevel),
    };

    if (score.title) titleMatches++;
    if (score.location) locationMatches++;
    if (score.level) levelMatches++;

    console.log(
      `\n================ JOB ${index + 1} ================`,
    );

    console.table({
      extractor: {
        title: extracted.title,
        location: extracted.location,
        level: extracted.level,
      },

      canonical: {
        title: canonical?.job?.title,
        location: canonical?.job?.location,
        level: canonical?.job?.jobLevel,
      },
    });

    console.table(score);
  }

  console.log("\n====================================");
  console.log("FINAL RESULTS");
  console.log("====================================");

  console.table({
    Title: {
      matched: titleMatches,
      total: jobRows.length,
      success:
        (
          (titleMatches / jobRows.length) *
          100
        ).toFixed(2) + "%",
    },

    Location: {
      matched: locationMatches,
      total: jobRows.length,
      success:
        (
          (locationMatches / jobRows.length) *
          100
        ).toFixed(2) + "%",
    },

    Level: {
      matched: levelMatches,
      total: jobRows.length,
      success:
        (
          (levelMatches / jobRows.length) *
          100
        ).toFixed(2) + "%",
    },
  });

  process.exit(0);
}

main().catch(console.error);
