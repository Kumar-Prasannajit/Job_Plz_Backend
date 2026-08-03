import { Prisma } from "@prisma/client";

import { prisma } from "../../../config/database.js";

import type { RawJob } from "../types/rawJob.types.js";
import type { RawJobPersistenceResult } from "../types/scraper.types.js";

class RawJobRepository {
  async create(
    job: RawJob,
  ) {
    try {
      return await prisma.rawJob.create({
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
          // Will be replaced later with SHA-256.
          contentHash: job.jobUrl,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return null;
      }

      throw error;
    }
  }

  async createMany(
    jobs: RawJob[],
  ): Promise<RawJobPersistenceResult> {
    const inserted = [];

    let duplicates = 0;
    let failed = 0;

    for (const job of jobs) {
      try {
        const saved = await this.create(job);

        if (!saved) {
          duplicates++;
          continue;
        }

        inserted.push(saved);
      } catch (error) {
        failed++;

        console.error(
          `Failed to save RawJob: ${job.jobTitle}`,
        );

        console.error(error);
      }
    }

    return {
      inserted,
      duplicates,
      failed,
    };
  }
}

export const rawJobRepository =
  new RawJobRepository();