import type { Benefits } from "../schemas/canonicalJob.schema.js";

import { cleanAndSortStringArray } from "../normalizers/utils/index.js";

export function normalizeBenefits(
  benefits: Benefits,
): Benefits {
  return {
    benefits: cleanAndSortStringArray(
      benefits.benefits,
    ),
  };
}