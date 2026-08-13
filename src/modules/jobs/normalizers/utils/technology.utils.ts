import {
  TECHNOLOGY_ALIASES,
  type TechnologyAliasKey,
  type TechnologyCanonicalName,
} from "../../../resumes/constants/technology-aliases.js";

import { normalizeString, isBlank } from "./string.utils.js";

import { TECHNOLOGY_CATEGORIES } from "../../../resumes/constants/technology-categories.js";

/**
 * Cached lookup of all canonical technology names.
 */
const CANONICAL_TECHNOLOGIES = new Set<TechnologyCanonicalName>(
  Object.values(TECHNOLOGY_ALIASES),
);

/**
 * Cached alias lookup.
 *
 * Using Map avoids repeatedly indexing the large object and gives
 * consistent O(1) lookups.
 */
const TECHNOLOGY_LOOKUP = new Map<TechnologyAliasKey, TechnologyCanonicalName>(
  Object.entries(TECHNOLOGY_ALIASES) as [
    TechnologyAliasKey,
    TechnologyCanonicalName,
  ][],
);

/**
 * Returns the normalized lookup key used by TECHNOLOGY_ALIASES.
 *
 * This helper MUST always match the normalization rules used when
 * generating technology-aliases.ts.
 *
 * Rules:
 * - trim
 * - collapse multiple spaces
 * - lowercase
 */
function normalizeLookupKey(value: string): TechnologyAliasKey {
  return normalizeString(value).toLowerCase() as TechnologyAliasKey;
}

/**
 * Returns the canonical technology name for a given input.
 *
 * If the technology is unknown, null is returned.
 *
 * Examples:
 *
 * "ReactJS"     -> "React.js"
 * " node js "   -> "Node.js"
 * "mongo db"    -> "MongoDB"
 * "abcxyz"      -> null
 */
export function getCanonicalTechnology(
  value: string | null | undefined,
): TechnologyCanonicalName | null {
  if (typeof value !== "string") {
    return null;
  }

  if (isBlank(value)) {
    return null;
  }

  const lookupKey = normalizeLookupKey(value);

  return TECHNOLOGY_LOOKUP.get(lookupKey) ?? null;
}

/**
 * Returns true if the supplied value exists in the alias database.
 */
export function isKnownTechnology(value: string | null | undefined): boolean {
  return getCanonicalTechnology(value) !== null;
}

/**
 * Returns true only if the supplied value is already a canonical
 * technology name.
 *
 * Examples:
 *
 * React.js -> true
 * ReactJS  -> false
 * react    -> false
 */
export function isCanonicalTechnology(
  value: string | null | undefined,
): boolean {
  if (typeof value !== "string") {
    return false;
  }

  if (isBlank(value)) {
    return false;
  }

  return CANONICAL_TECHNOLOGIES.has(value.trim() as TechnologyCanonicalName);
}

/**
 * Normalizes a technology name.
 *
 * If the technology exists in the alias database,
 * its canonical name is returned.
 *
 * Otherwise, the cleaned input is returned.
 *
 * Examples:
 *
 * ReactJS        -> React.js
 * node js        -> Node.js
 * mongodb        -> MongoDB
 * Unknown Tech   -> Unknown Tech
 */
export function normalizeTechnologyName(
  value: string | null | undefined,
): string {
  if (typeof value !== "string") {
    return "";
  }

  if (isBlank(value)) {
    return "";
  }

  const canonical = getCanonicalTechnology(value);

  if (canonical !== null) {
    return canonical;
  }

  return normalizeString(value);
}

/**
 * Normalizes an array of technologies.
 *
 * Operations performed:
 *
 * - remove null/undefined
 * - remove blank values
 * - normalize every technology
 * - remove duplicates
 * - sort alphabetically
 *
 * Output always contains canonical technology names
 * whenever aliases are known.
 */
export function normalizeTechnologyArray(
  technologies: readonly (string | null | undefined)[],
): string[] {
  if (technologies.length === 0) {
    return [];
  }

  const normalized = new Set<TechnologyCanonicalName | string>();

  for (const technology of technologies) {
    if (typeof technology !== "string") {
      continue;
    }

    if (isBlank(technology)) {
      continue;
    }

    normalized.add(normalizeTechnologyName(technology));
  }

  return [...normalized].sort((a, b) => a.localeCompare(b));
}

/**
 * Returns true if two technology names represent
 * the same canonical technology.
 *
 * Examples:
 *
 * ReactJS vs React.js
 * true
 *
 * node vs Node.js
 * true
 *
 * mongo db vs MongoDB
 * true
 *
 * React vs Angular
 * false
 */
export function technologyEquals(
  first: string | null | undefined,
  second: string | null | undefined,
): boolean {
  if (typeof first !== "string" || typeof second !== "string") {
    return false;
  }

  if (isBlank(first) || isBlank(second)) {
    return false;
  }

  return normalizeTechnologyName(first) === normalizeTechnologyName(second);
}

/**
 * Returns technologies that are NOT present
 * in the alias database.
 *
 * Useful for:
 * - expanding the alias database
 * - analytics
 * - QA
 * - logging unknown technologies
 *
 * Returned values are:
 * - normalized
 * - unique
 * - alphabetically sorted
 */
export function findUnknownTechnologies(
  technologies: readonly (string | null | undefined)[],
): string[] {
  if (technologies.length === 0) {
    return [];
  }

  const unknown = new Set<string>();

  for (const technology of technologies) {
    if (typeof technology !== "string") {
      continue;
    }

    if (isBlank(technology)) {
      continue;
    }

    if (!isKnownTechnology(technology)) {
      unknown.add(normalizeString(technology));
    }
  }

  return [...unknown].sort((a, b) => a.localeCompare(b));
}

/**
 * Alphabetically sorted list of every canonical
 * technology supported by the alias database.
 *
 * Useful for:
 * - validation
 * - autocomplete
 * - dropdowns
 * - analytics
 */
export const ALL_CANONICAL_TECHNOLOGIES: readonly TechnologyCanonicalName[] =
  Object.freeze([...CANONICAL_TECHNOLOGIES].sort((a, b) => a.localeCompare(b)));

// helps with O(1) lookups for technology categories
const TECHNOLOGY_CATEGORY_LOOKUP = new Map(
  Object.entries(TECHNOLOGY_CATEGORIES),
);

// Returns the category for a given technology, or null if not found
export type TechnologyCategory =
  (typeof TECHNOLOGY_CATEGORIES)[keyof typeof TECHNOLOGY_CATEGORIES];

/**
 * Returns the skill category for a technology.
 *
 * The technology may be:
 * - canonical
 * - alias
 * - mixed case
 *
 * Examples:
 *
 * ReactJS   -> frontend
 * react     -> frontend
 * Node.js   -> backend
 * PostgreSQL -> database
 *
 * Unknown technologies return null.
 */
export function getTechnologyCategory(
  value: string | null | undefined,
): TechnologyCategory | null {
  const canonical = getCanonicalTechnology(value);

  if (!canonical) {
    return null;
  }

  return TECHNOLOGY_CATEGORIES[canonical] ?? null;
}

/**
 * Categorizes technologies into Skills schema buckets.
 *
 * Unknown technologies are automatically placed into
 * miscellaneous.
 *
 * Input:
 *
 * [
 *   "React",
 *   "Node.js",
 *   "Postgres",
 *   "Redis"
 * ]
 *
 * Output:
 *
 * {
 *   frontend: ["React.js"],
 *   backend: ["Node.js"],
 *   database: ["PostgreSQL"],
 *   miscellaneous: ["Redis"],
 *   ...
 * }
 */
export function categorizeTechnologies(
  technologies: readonly (string | null | undefined)[],
) {
  const categorized = {
    ai: [] as string[],
    cloud: [] as string[],
    tools: [] as string[],
    devops: [] as string[],
    mobile: [] as string[],
    backend: [] as string[],
    testing: [] as string[],
    database: [] as string[],
    frontend: [] as string[],
    languages: [] as string[],
    softSkills: [] as string[],
    miscellaneous: [] as string[],
    operatingSystems: [] as string[],
  };

  const normalizedTechnologies =
    normalizeTechnologyArray(technologies);

  for (const technology of normalizedTechnologies) {
    const category =
      getTechnologyCategory(technology);

    if (category) {
      categorized[category].push(technology);
    } else {
      categorized.miscellaneous.push(
        technology,
      );
    }
  }

  return categorized;
}
