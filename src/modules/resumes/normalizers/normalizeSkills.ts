import type { Skills } from "../schemas/canonicalResume.schema.js";

import { cleanStringArray } from "./utils/array.utils.js";

import { normalizeTechnologyArray } from "./utils/technology.utils.js";

export function normalizeSkills(skills: Skills): Skills {
  return {
    languages: normalizeTechnologyArray(skills.languages),

    frontend: normalizeTechnologyArray(skills.frontend),

    backend: normalizeTechnologyArray(skills.backend),

    database: normalizeTechnologyArray(skills.database),

    cloud: normalizeTechnologyArray(skills.cloud),

    devops: normalizeTechnologyArray(skills.devops),

    testing: normalizeTechnologyArray(skills.testing),

    ai: normalizeTechnologyArray(skills.ai),

    mobile: normalizeTechnologyArray(skills.mobile),

    tools: normalizeTechnologyArray(skills.tools),

    operatingSystems: cleanStringArray(skills.operatingSystems),

    softSkills: cleanStringArray(skills.softSkills),

    miscellaneous: cleanStringArray(skills.miscellaneous),
  };
}
