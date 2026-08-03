import type { Compensation } from "../schemas/canonicalJob.schema.js";

import { normalizeString } from "../normalizers/utils/index.js";

export function normalizeCompensation(
  compensation: Compensation,
): Compensation {
  return {
    currency: normalizeString(
      compensation.currency,
    ),

    minimumSalary:
      compensation.minimumSalary ?? undefined,

    maximumSalary:
      compensation.maximumSalary ?? undefined,

    salaryPeriod:
      compensation.salaryPeriod,

    bonus: Boolean(
      compensation.bonus,
    ),

    equity: Boolean(
      compensation.equity,
    ),
  };
}