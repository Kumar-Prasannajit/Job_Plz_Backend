/**
 * ============================================================================
 * String Utilities
 * ============================================================================
 * Shared string helper functions for resume normalization.
 *
 * Design Principles:
 * - Pure functions
 * - No side effects
 * - Null-safe
 * - Never throw for normal string inputs
 * - Always return a string (except boolean helpers)
 * ============================================================================
 */

/**
 * Safely removes leading and trailing whitespace.
 *
 * @example
 * trimString("  Hello  ") -> "Hello"
 * trimString(undefined) -> ""
 */
export function trimString(value?: string | null): string {
  return value?.trim() ?? "";
}

/**
 * Replaces consecutive whitespace characters with a single space.
 * Handles spaces, tabs, and newlines.
 *
 * @example
 * collapseWhitespace("Hello     World") -> "Hello World"
 * collapseWhitespace("Hello\t\tWorld") -> "Hello World"
 */
export function collapseWhitespace(value?: string | null): string {
  return (value ?? "").replace(/\s+/g, " ");
}

/**
 * Trims the string and collapses multiple whitespace into one.
 *
 * @example
 * normalizeString("  John     Doe  ") -> "John Doe"
 */
export function normalizeString(value?: string | null): string {
  return collapseWhitespace(trimString(value));
}

/**
 * Capitalizes the first letter of every word.
 *
 * @example
 * capitalizeWords("full stack developer")
 * -> "Full Stack Developer"
 */
export function capitalizeWords(value?: string | null): string {
  const normalized = normalizeString(value);

  if (!normalized) {
    return "";
  }

  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Converts text to Title Case.
 *
 * Currently behaves the same as capitalizeWords().
 * Separated intentionally for future improvements like:
 * - "Software Engineer at Company"
 * - "Master of Science"
 */
export function toTitleCase(value?: string | null): string {
  return capitalizeWords(value);
}

/**
 * Removes excessive blank lines.
 *
 * Ensures at most one blank line exists between paragraphs.
 *
 * @example
 * Line1
 *
 *
 *
 * Line2
 *
 * becomes
 *
 * Line1
 *
 * Line2
 */
export function removeExtraNewlines(value?: string | null): string {
  return (value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Checks whether a string is empty after normalization.
 *
 * @example
 * isBlank("") -> true
 * isBlank("     ") -> true
 * isBlank("\n\t") -> true
 * isBlank("Hello") -> false
 */
export function isBlank(value?: string | null): boolean {
  return normalizeString(value).length === 0;
}

/**
 * Safely converts a string to lowercase.
 *
 * @example
 * toLowerCaseSafe("Hello") -> "hello"
 */
export function toLowerCaseSafe(value?: string | null): string {
  return normalizeString(value).toLowerCase();
}

/**
 * Safely converts a string to uppercase.
 *
 * @example
 * toUpperCaseSafe("Hello") -> "HELLO"
 */
export function toUpperCaseSafe(value?: string | null): string {
  return normalizeString(value).toUpperCase();
}

/**
 * Removes duplicate spaces while preserving line breaks.
 *
 * Useful for descriptions and summaries where paragraphs matter.
 *
 * @example
 * Hello      World
 *
 * This      is nice.
 *
 * ->
 *
 * Hello World
 *
 * This is nice.
 */
export function normalizeParagraph(value?: string | null): string {
  return (value ?? "")
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Removes all newline characters and converts text into a single line.
 *
 * @example
 * Hello
 * World
 *
 * ->
 *
 * Hello World
 */
export function toSingleLine(value?: string | null): string {
  return normalizeString((value ?? "").replace(/\r?\n/g, " "));
}

/**
 * Truncates a string without breaking words when possible.
 *
 * @example
 * truncate("Hello wonderful world", 10)
 * -> "Hello..."
 */
export function truncate(value: string, maxLength: number): string {
  const normalized = normalizeString(value);

  if (maxLength <= 0) {
    return "";
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const truncated = normalized.slice(0, maxLength);

  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return `${truncated.slice(0, lastSpace)}...`;
  }

  return `${truncated}...`;
}