import type { CanonicalResume } from "../schemas/canonicalResume.schema.js";

import { deepRemoveNullish } from "./utils/object.utils.js";
import { normalizeParagraph, normalizeString } from "./utils/string.utils.js";

import { normalizeAchievement } from "./normalizeAchievement.js";
import { normalizeCertification } from "./normalizeCertification.js";
import { normalizeEducation } from "./normalizeEducation.js";
import { normalizeExperience } from "./normalizeExperience.js";
import { normalizePersonal } from "./normalizePersonal.js";
import { normalizeProjects } from "./normalizeProjects.js";
import { normalizeSkills } from "./normalizeSkills.js";

export function normalizeResume(resume: CanonicalResume): CanonicalResume {
  return deepRemoveNullish({
    personal: normalizePersonal(resume.personal),

    summary: normalizeParagraph(resume.summary),

    skills: normalizeSkills(resume.skills),

    experience: normalizeExperience(resume.experience),

    education: normalizeEducation(resume.education),

    projects: normalizeProjects(resume.projects),

    certifications: normalizeCertification(resume.certifications),

    achievements: normalizeAchievement(resume.achievements),

    languages: resume.languages.map((language) => ({
      language: normalizeString(language.language),

      proficiency: language.proficiency,
    })),

    metadata: resume.metadata,
  }) as CanonicalResume;
}
