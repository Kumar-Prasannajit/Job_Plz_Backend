import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

import { formatJobSummary } from "./formatJobSummary.js";
import { formatRequirements } from "./formatRequirements.js";
import { formatSkills } from "./formatSkills.js";
import { formatResponsibilities } from "./formatResponsibilities.js";

export function formatJob(job: CanonicalJob): string {
  const sections: string[] = [];

  const summary = formatJobSummary(job.job);

  if (summary) {
    sections.push(summary);
  }

  const requirements = formatRequirements(job.requirements);

  if (requirements) {
    sections.push(requirements);
  }

  const skills = formatSkills(job.skills);

  if (skills) {
    sections.push(skills);
  }

  const responsibilities = formatResponsibilities(
    job.responsibilities,
  );

  if (responsibilities) {
    sections.push(responsibilities);
  }

  return sections.join("\n\n");
}