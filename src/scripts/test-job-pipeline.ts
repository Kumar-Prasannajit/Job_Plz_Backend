import { connectDB } from "../config/database.js";

import { prisma } from "../config/database.js";

import { jobService } from "../modules/jobs/services/job.service.js";

async function main() {
  await connectDB();

  console.log("========================================");
  console.log("🧪 Job Pipeline Test");
  console.log("========================================");

  const rawJob = await prisma.rawJob.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!rawJob) {
    throw new Error("No RawJob found in the database.");
  }

  console.log("\n📄 Testing Job");
  console.log("-------------------------");
  console.log("ID:", rawJob.id);
  console.log("Title:", rawJob.jobTitle);
  console.log("Company:", rawJob.companyName);
  console.log("Platform:", rawJob.platform);
  console.log("URL:", rawJob.jobUrl);

  const job = await jobService.process(rawJob);

  console.log("\n========================================");
  console.log("✅ Pipeline Completed Successfully");
  console.log("========================================");

  console.log(job);
}

main()
  .catch((error) => {
    console.error("\n❌ Pipeline Failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });