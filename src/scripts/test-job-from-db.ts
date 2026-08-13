import { prisma } from "../config/database.js";

import { normalizeJob } from "../modules/jobs/normalizers/normalizeJob.js";

async function main() {
  const job = await prisma.job.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!job) {
    throw new Error("No jobs found");
  }

  console.log("\n=================================");
  console.log("CANONICAL JOB FROM DB");
  console.log("=================================\n");

  const canonicalJob = job.canonicalData as any;

  console.log("\nSKILLS BEFORE:");
  console.dir(canonicalJob.skills, {
    depth: null,
  });

  const normalized = normalizeJob(canonicalJob);

  console.log("\nSKILLS AFTER:");
  console.dir(normalized.skills, {
    depth: null,
  });

  console.log("\nREQUIREMENTS:");
  console.dir(normalized.requirements, {
    depth: null,
  });

  console.log("\nSUMMARY:");
  console.log(normalized.job.summary);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });