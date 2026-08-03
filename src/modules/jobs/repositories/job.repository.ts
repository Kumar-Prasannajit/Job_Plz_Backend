import { prisma } from "../../../config/database.js";

import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

class JobRepository {
  async create(
    rawJobId: string,
    canonicalJob: CanonicalJob,
  ) {
    return prisma.job.create({
      data: {
        rawJobId,

        canonicalData: canonicalJob,

        schemaVersion:
          canonicalJob.metadata.parserVersion,
      },
    });
  }

  async findByRawJobId(
    rawJobId: string,
  ) {
    return prisma.job.findUnique({
      where: {
        rawJobId,
      },
    });
  }

  async findById(
    id: string,
  ) {
    return prisma.job.findUnique({
      where: {
        id,
      },
    });
  }

  async delete(
    id: string,
  ) {
    return prisma.job.delete({
      where: {
        id,
      },
    });
  }
}

export const jobRepository =
  new JobRepository();