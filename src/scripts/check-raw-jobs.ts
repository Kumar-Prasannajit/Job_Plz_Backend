// src/scripts/check-raw-jobs.ts

import { desc } from "drizzle-orm";

import { db } from "../db/client.js";
import { rawJobs } from "../db/schema.js";

async function main() {
  const jobs = await db
    .select({
      id: rawJobs.id,
      platform: rawJobs.platform,
      jobTitle: rawJobs.jobTitle,
      companyName: rawJobs.companyName,
      scrapedAt: rawJobs.scrapedAt,
    })
    .from(rawJobs)
    .orderBy(desc(rawJobs.scrapedAt))
    .limit(5);

  console.table(jobs);

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
