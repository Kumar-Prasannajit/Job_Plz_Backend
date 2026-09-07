import { eq, inArray } from "drizzle-orm";

import { db } from "../../../db/client.js";
import { jobs } from "../../../db/schema.js";

import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

class JobRepository {
  async create(rawJobId: string, canonicalJob: CanonicalJob) {
    const [saved] = await db
      .insert(jobs)
      .values({
        rawJobId,

        canonicalData: canonicalJob,

        schemaVersion: canonicalJob.metadata.parserVersion,
      })
      .returning();

    if (!saved) {
      throw new Error(`Failed to create job for rawJobId: ${rawJobId}`);
    }

    return saved;
  }

  async findByRawJobId(rawJobId: string) {
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.rawJobId, rawJobId))
      .limit(1);

    return job ?? null;
  }

  async findById(id: string) {
    const job = await db.query.jobs.findFirst({
      where: eq(jobs.id, id),
      with: {
        rawJob: true,
      },
    });

    return job ?? null;
  }

  async delete(id: string) {
    const [deleted] = await db
      .delete(jobs)
      .where(eq(jobs.id, id))
      .returning();

    return deleted;
  }

  async findManyByIds(ids: string[]) {
    return db.select().from(jobs).where(inArray(jobs.id, ids));
  }
}

export const jobRepository = new JobRepository();
