/**
 * ============================================================================
 * Array Utilities
 * ============================================================================
 * Shared helper functions for array normalization.
 *
 * Design Principles:
 * - Pure functions
 * - Generic where possible
 * - Null-safe
 * - Never mutate input arrays
 * ============================================================================
 */

import { isBlank, normalizeString } from "./string.utils.js";

/**
 * Removes duplicate values while preserving order.
 *
 * @example
 * uniqueArray(["React", "Node", "React"])
 * // ["React", "Node"]
 */
export function uniqueArray<T>(array?: readonly T[] | null): T[] {
  if (!array?.length) {
    return [];
  }

  return [...new Set(array)];
}

/**
 * Returns a sorted copy of the array.
 *
 * Uses localeCompare for strings.
 *
 * @example
 * sortArray(["Node", "React", "Angular"])
 * // ["Angular", "Node", "React"]
 */
export function sortArray<T extends string>(
  array?: readonly T[] | null
): T[] {
  if (!array?.length) {
    return [];
  }

  return [...array].sort((a, b) => a.localeCompare(b));
}

/**
 * Removes blank strings.
 *
 * @example
 * removeEmptyValues(["React", "", " ", "Node"])
 * // ["React", "Node"]
 */
export function removeEmptyValues(
  array?: readonly string[] | null
): string[] {
  if (!array?.length) {
    return [];
  }

  return array.filter((item) => !isBlank(item));
}

/**
 * Trims and normalizes every string.
 *
 * @example
 * normalizeStringArray([
 *   " React ",
 *   " Node.js "
 * ])
 *
 * // ["React", "Node.js"]
 */
export function normalizeStringArray(
  array?: readonly string[] | null
): string[] {
  if (!array?.length) {
    return [];
  }

  return array.map(normalizeString);
}

/**
 * Complete cleanup for string arrays.
 *
 * Performs:
 * - trim
 * - whitespace normalization
 * - remove blanks
 * - remove duplicates
 *
 * Order is preserved.
 *
 * @example
 * cleanStringArray([
 *   "",
 *   " React ",
 *   "Node",
 *   "React",
 *   " "
 * ])
 *
 * // ["React", "Node"]
 */
export function cleanStringArray(
  array?: readonly string[] | null
): string[] {
  return uniqueArray(
    removeEmptyValues(normalizeStringArray(array))
  );
}

/**
 * Cleans and sorts a string array.
 *
 * Useful for skills, technologies, tools, etc.
 *
 * @example
 * cleanAndSortStringArray([
 *   "Node",
 *   "React",
 *   "Node"
 * ])
 *
 * // ["Node", "React"]
 */
export function cleanAndSortStringArray(
  array?: readonly string[] | null
): string[] {
  return sortArray(cleanStringArray(array));
}

/**
 * Removes duplicate objects based on a selector.
 *
 * @example
 * uniqueBy(users, user => user.email)
 */
export function uniqueBy<T, K>(
  array: readonly T[] | null | undefined,
  selector: (item: T) => K
): T[] {
  if (!array?.length) {
    return [];
  }

  const seen = new Set<K>();

  return array.filter((item) => {
    const key = selector(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

/**
 * Splits an array into chunks.
 *
 * @example
 * chunkArray([1,2,3,4,5],2)
 *
 * // [[1,2],[3,4],[5]]
 */
export function chunkArray<T>(
  array: readonly T[] | null | undefined,
  size: number
): T[][] {
  if (!array?.length || size <= 0) {
    return [];
  }

  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

/**
 * Returns whether an array is empty or undefined.
 */
export function isEmptyArray<T>(
  array?: readonly T[] | null
): boolean {
  return !array || array.length === 0;
}

/**
 * Returns whether an array has at least one element.
 */
export function hasItems<T>(
  array?: readonly T[] | null
): boolean {
  return !isEmptyArray(array);
}