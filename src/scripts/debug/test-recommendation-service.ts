import { desc } from "drizzle-orm";

import { db } from "../../db/client.js";
import { resumes } from "../../db/schema.js";

import { recommendationService } from "../../modules/recommendation/services/recommendation.service.js";

async function main() {
  const [resume] = await db
    .select()
    .from(resumes)
    .orderBy(desc(resumes.createdAt))
    .limit(1);

  if (!resume) {
    throw new Error(
      "No resumes found.",
    );
  }

  console.log(
    `Testing recommendations for resume: ${resume.id}`,
  );

  const recommendations =
    await recommendationService.recommend(
      resume.id,
    );

  console.log("");
  console.log(
    "========================================",
  );
  console.log(
    "🎯 Recommendation Results",
  );
  console.log(
    "========================================",
  );

  if (recommendations.length === 0) {
    console.log(
      "No recommendations found.",
    );
    return;
  }

  console.table(
    recommendations.map((job) => ({
      title: job.title,
      company: job.company,
      location: job.location,
      score: job.score,
      jobId: job.jobId,
    })),
  );

  console.log("");
  console.log(
    `Returned ${recommendations.length} recommendation(s)`,
  );

  console.log("");
  console.log("🏆 Top Match");
  console.log(
    recommendations[0],
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
