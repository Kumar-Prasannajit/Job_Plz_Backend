import { Prisma } from "@prisma/client";

import { prisma } from "../../../config/database.js";

import type { RawJob } from "../types/rawJob.types.js";
import type { RawJobPersistenceResult } from "../types/scraper.types.js";

class RawJobRepository {
  async create(job: RawJob) {
    return prisma.rawJob.create({
      data: {
        jobUrl: job.jobUrl,

        platform: job.platform ?? null,
        platformJobId: job.platformJobId ?? null,

        companyName: job.companyName,
        companyWebsite: job.companyWebsite ?? null,
        companyLogoUrl: job.companyLogoUrl ?? null,

        jobTitle: job.jobTitle,

        rawHtml: job.rawHtml ?? null,
        rawText: job.rawText,
        rawJson: job.rawJson ?? Prisma.JsonNull,

        location: job.location ?? null,

        scrapedAt: job.scrapedAt,

        contentHash: job.jobUrl,
      },
    });
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
    const existing = await prisma.rawJob.findMany({
      where: {
        jobUrl: {
          in: jobs.map((job) => job.jobUrl),
        },
      },
      select: {
        jobUrl: true,
      },
    });

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
}

export const rawJobRepository = new RawJobRepository();
