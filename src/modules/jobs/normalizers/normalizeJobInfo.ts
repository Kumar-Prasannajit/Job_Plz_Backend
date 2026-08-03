import type { Job } from "../schemas/canonicalJob.schema.js";

import {
  normalizeString,
  normalizeParagraph,
} from "../normalizers/utils/index.js";

export function normalizeJobInfo(job: Job): Job {
  return {
    title: normalizeString(job.title),

    department: normalizeString(job.department),

    // Already validated by Zod.
    employmentType: job.employmentType,

    // Already validated by Zod.
    workMode: job.workMode,

    // Already validated by Zod.
    jobLevel: job.jobLevel,

    jobFunction: normalizeString(job.jobFunction),

    summary: normalizeParagraph(job.summary),
  };
}