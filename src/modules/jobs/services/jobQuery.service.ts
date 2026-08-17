import { ApiError } from "../../../utils/index.js";

import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

import { jobRepository } from "../repositories/job.repository.js";

class JobQueryService {
  async getById(jobId: string) {
    const job = await jobRepository.findById(jobId);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    const canonical = job.canonicalData as CanonicalJob;

    console.dir(canonical, {
      depth: null,
    });
    
    return {
      id: job.id,

      job: canonical.job,

      company: canonical.company,

      location: canonical.location,

      requirements: canonical.requirements,

      skills: canonical.skills,

      responsibilities: canonical.responsibilities,

      compensation: canonical.compensation,

      benefits: canonical.benefits,

      metadata: canonical.metadata,

      jobUrl: job.rawJob?.jobUrl ?? null,

      createdAt: job.createdAt,
    };
  }
}

export const jobQueryService = new JobQueryService();
