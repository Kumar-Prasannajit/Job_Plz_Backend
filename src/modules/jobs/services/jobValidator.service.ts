import { CanonicalJobSchema } from "../schemas/canonicalJob.schema.js";

import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

class JobValidatorService {
  validate(
    job: CanonicalJob,
  ): CanonicalJob {
    return CanonicalJobSchema.parse(job);
  }
}

export const jobValidatorService =
  new JobValidatorService();