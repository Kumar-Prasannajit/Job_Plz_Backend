import { count, desc } from "drizzle-orm";

import { db } from "../../../db/client.js";
import { jobEmbeddings, jobs, rawJobs } from "../../../db/schema.js";

class DashboardRepository {
  async countRawJobsByStatus() {
    return db
      .select({ status: rawJobs.status, count: count() })
      .from(rawJobs)
      .groupBy(rawJobs.status);
  }

  async countJobs(): Promise<number> {
    const [row] = await db.select({ count: count() }).from(jobs);

    return row?.count ?? 0;
  }

  async countJobEmbeddings(): Promise<number> {
    const [row] = await db.select({ count: count() }).from(jobEmbeddings);

    return row?.count ?? 0;
  }

  async countRawJobsByPlatformAndStatus() {
    return db
      .select({
        platform: rawJobs.platform,
        status: rawJobs.status,
        count: count(),
      })
      .from(rawJobs)
      .groupBy(rawJobs.platform, rawJobs.status);
  }

  async findRecent(limit: number) {
    return db
      .select({
        id: rawJobs.id,
        jobTitle: rawJobs.jobTitle,
        companyName: rawJobs.companyName,
        platform: rawJobs.platform,
        status: rawJobs.status,
        scrapedAt: rawJobs.scrapedAt,
      })
      .from(rawJobs)
      .orderBy(desc(rawJobs.scrapedAt))
      .limit(limit);
  }
}

export const dashboardRepository = new DashboardRepository();
