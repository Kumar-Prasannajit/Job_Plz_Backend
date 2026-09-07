import { eq, inArray } from "drizzle-orm";

import { db } from "../../../db/client.js";
import { rawJobs } from "../../../db/schema.js";

import type { RawJob } from "../types/rawJob.types.js";
import type { RawJobPersistenceResult } from "../types/scraper.types.js";

class RawJobRepository {
  async findById(id: string) {
    const [rawJob] = await db
      .select()
      .from(rawJobs)
      .where(eq(rawJobs.id, id))
      .limit(1);

    return rawJob ?? null;
  }

  async create(job: RawJob) {
    const [saved] = await db
      .insert(rawJobs)
      .values({
        jobUrl: job.jobUrl,

        platform: job.platform ?? null,
        platformJobId: job.platformJobId ?? null,

        companyName: job.companyName,
        companyWebsite: job.companyWebsite ?? null,
        companyLogoUrl: job.companyLogoUrl ?? null,

        jobTitle: job.jobTitle,

        rawHtml: job.rawHtml ?? null,
        rawText: job.rawText,
        rawJson: job.rawJson ?? null,

        location: job.location ?? null,

        scrapedAt: job.scrapedAt,

        contentHash: job.jobUrl,
      })
      .returning();

    return saved;
  }

  async createMany(jobs: RawJob[]): Promise<RawJobPersistenceResult> {
    if (jobs.length === 0) {
      return {
        inserted: [],
        duplicates: 0,
        failed: 0,
      };
    }

    // Find existing jobs first
    const existing = await db
      .select({ jobUrl: rawJobs.jobUrl })
      .from(rawJobs)
      .where(
        inArray(
          rawJobs.jobUrl,
          jobs.map((job) => job.jobUrl),
        ),
      );

    const existingUrls = new Set(existing.map((job) => job.jobUrl));

    const jobsToInsert = jobs.filter((job) => !existingUrls.has(job.jobUrl));

    const inserted = [];

    let failed = 0;

    for (const job of jobsToInsert) {
      try {
        const saved = await this.create(job);

        if (saved) {
          inserted.push(saved);
        }
      } catch (error) {
        failed++;

        console.error(`Failed to save RawJob: ${job.jobTitle}`);

        console.error(error);
      }
    }

    return {
      inserted,

      duplicates: jobs.length - jobsToInsert.length,

      failed,
    };
  }

  async markQueued(id: string) {
    const [updated] = await db
      .update(rawJobs)
      .set({
        status: "QUEUED",
        failureReason: null,
      })
      .where(eq(rawJobs.id, id))
      .returning();

    return updated;
  }

  async markProcessing(id: string) {
    const [updated] = await db
      .update(rawJobs)
      .set({
        status: "PROCESSING",
        failureReason: null,
      })
      .where(eq(rawJobs.id, id))
      .returning();

    return updated;
  }

  async markCompleted(id: string) {
    const [updated] = await db
      .update(rawJobs)
      .set({
        status: "COMPLETED",
        processedAt: new Date(),
        failureReason: null,
      })
      .where(eq(rawJobs.id, id))
      .returning();

    return updated;
  }

  async markFailed(id: string, reason: string) {
    const [updated] = await db
      .update(rawJobs)
      .set({
        status: "FAILED",
        failureReason: reason,
      })
      .where(eq(rawJobs.id, id))
      .returning();

    return updated;
  }
}

export const rawJobRepository = new RawJobRepository();
