// src/scripts/test-google-provider-end-to-end.ts

import { desc, eq } from "drizzle-orm";

import { db } from "../../db/client.js";
import { rawJobs } from "../../db/schema.js";
import { googleCanonicalProvider } from "../../modules/jobs/providers/google/googleCanonicalProvider.js";

const [rawJob] = await db
  .select()
  .from(rawJobs)
  .where(eq(rawJobs.platform, "Google Careers"))
  .orderBy(desc(rawJobs.scrapedAt))
  .limit(1);

if (!rawJob) {
  throw new Error("No Google raw jobs found");
}

const canonicalJob =
  await googleCanonicalProvider.map(rawJob);

console.dir(canonicalJob, {
  depth: null,
});

process.exit(0);
