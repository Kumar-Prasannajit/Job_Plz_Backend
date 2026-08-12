// src/scripts/test-google-provider-end-to-end.ts

import { prisma } from "../config/database.js";
import { googleCanonicalProvider } from "../modules/jobs/providers/google/googleCanonicalProvider.js";

const rawJob = await prisma.rawJob.findFirst({
  where: {
    platform: "Google Careers",
  },
  orderBy: {
    scrapedAt: "desc",
  },
});

if (!rawJob) {
  throw new Error("No Google raw jobs found");
}

const canonicalJob =
  await googleCanonicalProvider.map(rawJob);

console.dir(canonicalJob, {
  depth: null,
});