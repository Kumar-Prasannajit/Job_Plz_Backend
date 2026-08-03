import type { Requirements } from "../schemas/canonicalJob.schema.js";

import {
  cleanAndSortStringArray,
  normalizeString,
} from "../normalizers/utils/index.js";

export function normalizeRequirements(
  requirements: Requirements,
): Requirements {
  return {
    minimumEducation: normalizeString(
      requirements.minimumEducation,
    ),

    preferredEducation: normalizeString(
      requirements.preferredEducation,
    ),

    minimumExperienceYears:
      requirements.minimumExperienceYears ?? 0,

    preferredExperienceYears:
      requirements.preferredExperienceYears ?? 0,

    requiredExperience: cleanAndSortStringArray(
      requirements.requiredExperience,
    ),

    preferredExperience: cleanAndSortStringArray(
      requirements.preferredExperience,
    ),

    certifications: cleanAndSortStringArray(
      requirements.certifications,
    ),

    languages: cleanAndSortStringArray(
      requirements.languages,
    ),

    domainKnowledge: cleanAndSortStringArray(
      requirements.domainKnowledge,
    ),
  };
}