import type { CanonicalJob } from "../../schemas/canonicalJob.schema.js";

import {
  TECHNOLOGY_ALIASES,
  type TechnologyCanonicalName,
} from "../../../resumes/constants/technology-aliases.js";

import { normalizeString } from "./string.utils.js";

/**
 * Extracts known technologies from a CanonicalJob.
 *
 * Technologies are identified using the technology alias
 * knowledge base and returned as canonical names.
 *
 * Sources scanned:
 * - job.summary
 * - requirements.requiredExperience
 * - requirements.preferredExperience
 * - requirements.languages
 * - responsibilities.*
 *
 * Output:
 * - canonical technology names
 * - unique
 * - alphabetically sorted
 */
export function extractTechnologiesFromJob(
  job: CanonicalJob,
): TechnologyCanonicalName[] {
  const searchableText = normalizeString(
    [
      job.job.summary,

      ...job.requirements.requiredExperience,
      ...job.requirements.preferredExperience,

      ...job.requirements.languages,

      ...job.responsibilities.primary,
      ...job.responsibilities.secondary,
      ...job.responsibilities.leadership,
      ...job.responsibilities.communication,
      ...job.responsibilities.other,
    ].join(" "),
  ).toLowerCase();

  const found = new Set<TechnologyCanonicalName>();

  for (const [alias, canonical] of Object.entries(
    TECHNOLOGY_ALIASES,
  ) as [string, TechnologyCanonicalName][]) {
    const escapedAlias = alias.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    const pattern = new RegExp(
      `(^|\\W)${escapedAlias}(\\W|$)`,
      "i",
    );

    if (pattern.test(searchableText)) {
      found.add(canonical);
    }
  }

  return [...found].sort((a, b) =>
    a.localeCompare(b),
  );
}