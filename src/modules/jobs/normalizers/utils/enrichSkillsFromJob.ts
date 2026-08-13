import type { CanonicalJob } from "../../schemas/canonicalJob.schema.js";
import type { Skills } from "../../../resumes/schemas/canonicalResume.schema.js";

import { categorizeTechnologies } from "./technology.utils.js";
import { extractTechnologiesFromJob } from "./extractTechnologiesFromJob.js";

function mergeUnique(
  existing: readonly string[],
  incoming: readonly string[],
): string[] {
  return [...new Set([...existing, ...incoming])].sort(
    (a, b) => a.localeCompare(b),
  );
}

export function enrichSkillsFromJob(
  job: CanonicalJob,
): Skills {
  const extractedTechnologies =
    extractTechnologiesFromJob(job);

  const categorized =
    categorizeTechnologies(extractedTechnologies);

  return {
    ai: mergeUnique(
      job.skills.ai,
      categorized.ai,
    ),

    cloud: mergeUnique(
      job.skills.cloud,
      categorized.cloud,
    ),

    tools: mergeUnique(
      job.skills.tools,
      categorized.tools,
    ),

    devops: mergeUnique(
      job.skills.devops,
      categorized.devops,
    ),

    mobile: mergeUnique(
      job.skills.mobile,
      categorized.mobile,
    ),

    backend: mergeUnique(
      job.skills.backend,
      categorized.backend,
    ),

    testing: mergeUnique(
      job.skills.testing,
      categorized.testing,
    ),

    database: mergeUnique(
      job.skills.database,
      categorized.database,
    ),

    frontend: mergeUnique(
      job.skills.frontend,
      categorized.frontend,
    ),

    languages: mergeUnique(
      job.skills.languages,
      categorized.languages,
    ),

    operatingSystems: mergeUnique(
      job.skills.operatingSystems,
      categorized.operatingSystems,
    ),

    miscellaneous: mergeUnique(
      job.skills.miscellaneous,
      categorized.miscellaneous,
    ),

    softSkills: job.skills.softSkills,
  };
}