// src/scripts/debug-google-raw-text.ts

import { prisma } from "../config/database.js";

async function main() {
  const rawJob = await prisma.rawJob.findFirst({
    where: {
      platform: "Google Careers",
    },
    orderBy: {
      scrapedAt: "desc",
    },
  });

  if (!rawJob) {
    console.log("No Google job found");
    return;
  }

  console.log(rawJob.rawText);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());