import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

import { normalizeJobInfo } from "./normalizeJobInfo.js";
import { normalizeCompany } from "./normalizeCompany.js";
import { normalizeLocation } from "./normalizeLocation.js";
import { normalizeRequirements } from "./normalizeRequirements.js";
import { normalizeSkills } from "./normalizeSkills.js";
import { normalizeResponsibilities } from "./normalizeResponsibilities.js";
import { normalizeCompensation } from "./normalizeCompensation.js";
import { normalizeBenefits } from "./normalizeBenefits.js";
import { normalizeMetadata } from "./normalizeMetadata.js";

export function normalizeJob(
  job: CanonicalJob,
): CanonicalJob {
  return {
    job: normalizeJobInfo(job.job),

    company: normalizeCompany(job.company),

    location: normalizeLocation(job.location),

    requirements: normalizeRequirements(
      job.requirements,
    ),

    skills: normalizeSkills(job.skills),

    responsibilities: normalizeResponsibilities(
      job.responsibilities,
    ),

    compensation: normalizeCompensation(
      job.compensation,
    ),

    benefits: normalizeBenefits(
      job.benefits,
    ),

    metadata: normalizeMetadata(
      job.metadata,
    ),
  };
}