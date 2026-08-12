import { prisma } from "../config/database.js";

import { googleCanonicalProvider } from "../modules/jobs/providers/google/googleCanonicalProvider.js";

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

  console.log({
    companyName: rawJob.companyName,
    companyWebsite: rawJob.companyWebsite,
  });

  const canonicalJob = await googleCanonicalProvider.map(rawJob);

  console.dir(canonicalJob, {
    depth: null,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
