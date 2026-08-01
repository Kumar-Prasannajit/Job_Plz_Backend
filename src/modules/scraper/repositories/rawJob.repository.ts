import { Prisma } from "@prisma/client";

import { prisma } from "../../../config/database.js";

import type { RawJob } from "../types/rawJob.types.js";

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

        // Temporary placeholder.
        // Will be replaced later with SHA-256 hash.
        contentHash: job.jobUrl,
      },
    });
  }

  async createMany(jobs: RawJob[]) {
    for (const job of jobs) {
      await this.create(job);
    }
  }
}

export const rawJobRepository = new RawJobRepository();