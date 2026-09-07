// src/scripts/debug-google-raw-text.ts

import { desc, eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { rawJobs } from "../../db/schema.js";

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

  console.log(rawJob.rawText);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
