// src/scripts/check-raw-jobs.ts

import { prisma } from "../config/database.js";

async function main() {
  const jobs = await prisma.rawJob.findMany({
    take: 5,
    orderBy: {
      scrapedAt: "desc",
    },
    select: {
      id: true,
      platform: true,
      jobTitle: true,
      companyName: true,
      scrapedAt: true,
    },
  });

  console.table(jobs);

  await prisma.$disconnect();
}

main().catch(console.error);