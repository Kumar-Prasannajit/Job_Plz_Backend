import { prisma } from "../config/database.js";
import { googleSectionExtractor } from "../modules/scraper/providers/google/googleSectionExtractor.js";

function normalize(value: unknown) {
  if (!value) return "";

  return String(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const jobs = await prisma.job.findMany({
    take: 50,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      rawJob: true,
    },
  });

  console.log(`Testing ${jobs.length} jobs...\n`);

  let titleMatches = 0;
  let locationMatches = 0;
  let levelMatches = 0;

  for (const [index, job] of jobs.entries()) {
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
      total: jobs.length,
      success:
        (
          (titleMatches / jobs.length) *
          100
        ).toFixed(2) + "%",
    },

    Location: {
      matched: locationMatches,
      total: jobs.length,
      success:
        (
          (locationMatches / jobs.length) *
          100
        ).toFixed(2) + "%",
    },

    Level: {
      matched: levelMatches,
      total: jobs.length,
      success:
        (
          (levelMatches / jobs.length) *
          100
        ).toFixed(2) + "%",
    },
  });

  await prisma.$disconnect();
}

main().catch(console.error);