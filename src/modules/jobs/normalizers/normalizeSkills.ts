import type { Skills } from "../../resumes/schemas/canonicalResume.schema.js";

import {
  cleanAndSortStringArray,
  normalizeTechnologyArray,
} from "../normalizers/utils/index.js";

export function normalizeSkills(skills: Skills): Skills {
  return {
    languages: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.languages),
    ),

    frontend: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.frontend),
    ),

    backend: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.backend),
    ),

    database: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.database),
    ),

    cloud: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.cloud),
    ),

    devops: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.devops),
    ),

    testing: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.testing),
    ),

    ai: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.ai),
    ),

    operatingSystems: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.operatingSystems),
    ),

    mobile: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.mobile),
    ),

    tools: normalizeTechnologyArray(
      cleanAndSortStringArray(skills.tools),
    ),

    softSkills: cleanAndSortStringArray(
      skills.softSkills,
    ),

    miscellaneous: cleanAndSortStringArray(
      skills.miscellaneous,
    ),
  };
}