import type { CanonicalResume } from "../../resumes/schemas/canonicalResume.schema.js";
import type { ResumeChunk } from "../types.js";

import {
  formatAchievements,
  formatCertifications,
  formatEducation,
  formatExperience,
  formatLanguages,
  formatProjects,
  formatSkills,
  formatSummary,
} from "./formatters/index.js";

export function formatResume(
  resume: CanonicalResume,
): ResumeChunk[] {
  return [
    ...formatSummary(resume),
    ...formatSkills(resume),
    ...formatExperience(resume),
    ...formatProjects(resume),
    ...formatEducation(resume),
    ...formatCertifications(resume),
    ...formatAchievements(resume),
    ...formatLanguages(resume),
  ];
}