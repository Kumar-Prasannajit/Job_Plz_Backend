import type { Responsibilities } from "../schemas/canonicalJob.schema.js";

import { cleanAndSortStringArray } from "../normalizers/utils/index.js";

export function normalizeResponsibilities(
  responsibilities: Responsibilities,
): Responsibilities {
  return {
    primary: cleanAndSortStringArray(
      responsibilities.primary,
    ),

    secondary: cleanAndSortStringArray(
      responsibilities.secondary,
    ),

    leadership: cleanAndSortStringArray(
      responsibilities.leadership,
    ),

    communication: cleanAndSortStringArray(
      responsibilities.communication,
    ),

    other: cleanAndSortStringArray(
      responsibilities.other,
    ),
  };
}