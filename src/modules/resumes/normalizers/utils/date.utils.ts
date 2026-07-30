import { isBlank, normalizeString } from "../utils/string.utils.js";

/**
 * Canonical value used for ongoing dates.
 */
export const PRESENT_DATE = "Present";

/**
 * Month name lookup.
 */
const MONTHS = new Map<string, string>([
  ["jan", "01"],
  ["january", "01"],

  ["feb", "02"],
  ["february", "02"],

  ["mar", "03"],
  ["march", "03"],

  ["apr", "04"],
  ["april", "04"],

  ["may", "05"],

  ["jun", "06"],
  ["june", "06"],

  ["jul", "07"],
  ["july", "07"],

  ["aug", "08"],
  ["august", "08"],

  ["sep", "09"],
  ["sept", "09"],
  ["september", "09"],

  ["oct", "10"],
  ["october", "10"],

  ["nov", "11"],
  ["november", "11"],

  ["dec", "12"],
  ["december", "12"],
]);

/**
 * Reverse lookup used for formatting.
 */
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Supported "present" aliases.
 */
const PRESENT_LOOKUP = new Set([
  "present",
  "current",
  "ongoing",
  "now",
  "till date",
  "till now",
  "to date",
]);

/**
 * Pads a number with a leading zero.
 */
function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

/**
 * Returns true if a year is four digits.
 */
function isValidYear(year: string): boolean {
  return /^\d{4}$/.test(year);
}

/**
 * Returns true if month is between 1 and 12.
 */
function isValidMonth(month: string): boolean {
  const value = Number(month);

  return Number.isInteger(value) && value >= 1 && value <= 12;
}

/**
 * Returns true if day is between 1 and 31.
 *
 * Calendar validation is intentionally not performed.
 */
function isValidDay(day: string): boolean {
  const value = Number(day);

  return Number.isInteger(value) && value >= 1 && value <= 31;
}

/**
 * Converts month names to numeric month.
 *
 * Example:
 *
 * Jan -> 01
 * January -> 01
 */
function normalizeMonth(month: string): string | null {
  if (isBlank(month)) {
    return null;
  }

  const normalized = normalizeString(month).toLowerCase();

  return MONTHS.get(normalized) ?? null;
}

/**
 * Returns true if the supplied value represents
 * an ongoing date.
 */
export function isPresentDate(value: string | null | undefined): boolean {
  if (typeof value !== "string") {
    return false;
  }

  if (isBlank(value)) {
    return false;
  }

  const normalized = normalizeString(value).toLowerCase();

  return PRESENT_LOOKUP.has(normalized);
}

/**
 * Normalizes a year.
 *
 * Examples:
 *
 * "2025" -> "2025"
 * " 2025 " -> "2025"
 *
 * Invalid values return null.
 */
export function normalizeYear(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  if (isBlank(value)) {
    return null;
  }

  const normalized = normalizeString(value);

  return isValidYear(normalized) ? normalized : null;
}

/**
 * Normalizes a year/month value.
 *
 * Supported formats:
 *
 * 2025-01
 * 2025-1
 * 01/2025
 * 1/2025
 * Jan 2025
 * January 2025
 *
 * Returns:
 *
 * YYYY-MM
 *
 * or null if parsing fails.
 */
export function normalizeYearMonth(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  if (isBlank(value)) {
    return null;
  }

  const normalized = normalizeString(value);

  //
  // YYYY-MM
  //
  let match = normalized.match(/^(\d{4})[-/](\d{1,2})$/);

  if (match) {
    const [year, month] = [match[1], match[2]];

    if (
      year !== undefined &&
      month !== undefined &&
      isValidYear(year) &&
      isValidMonth(month)
    ) {
      return `${year}-${pad2(Number(month))}`;
    }

    return null;
  }

  //
  // MM/YYYY
  //
  match = normalized.match(/^(\d{1,2})[-/](\d{4})$/);

  if (match) {
    const [year, month] = [match[1], match[2]];

    if (
      year !== undefined &&
      month !== undefined &&
      isValidYear(year) &&
      isValidMonth(month)
    ) {
      return `${year}-${pad2(Number(month))}`;
    }

    return null;
  }

  //
  // Month YYYY
  //
  match = normalized.match(/^([A-Za-z]+)\s+(\d{4})$/);

  if (match) {
    const [monthName, year] = [match[1], match[2]];

    if (monthName !== undefined && year !== undefined) {
      const month = normalizeMonth(monthName);

      if (month && isValidYear(year)) {
        return `${year}-${month}`;
      }
    }
  }

  return null;
}

/**
 * Normalizes a full date.
 *
 * Supported formats:
 *
 * 2025-01-15
 * 2025/01/15
 * 15-01-2025
 * 15/01/2025
 * 15 Jan 2025
 * 15 January 2025
 *
 * Returns:
 *
 * YYYY-MM-DD
 * Present
 * null
 */
/**
 * Normalizes a full date.
 *
 * Supported formats:
 *
 * 2025-01-15
 * 2025/01/15
 * 15-01-2025
 * 15/01/2025
 * 15 Jan 2025
 * 15 January 2025
 *
 * Returns:
 *
 * YYYY-MM-DD
 * Present
 * null
 */
export function normalizeDate(value: string | null | undefined): string | null {
  if (typeof value !== "string" || isBlank(value)) {
    return null;
  }

  if (isPresentDate(value)) {
    return PRESENT_DATE;
  }

  const normalized = normalizeString(value);

  //
  // YYYY-MM-DD
  //
  let match = normalized.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);

  if (match) {
    const year = match[1];
    const month = match[2];
    const day = match[3];

    if (year !== undefined && month !== undefined && day !== undefined) {
      const yearMonth = normalizeYearMonth(`${year}-${month}`);

      if (yearMonth && isValidDay(day)) {
        return `${yearMonth}-${pad2(Number(day))}`;
      }
    }

    const yearMonth = normalizeYearMonth(normalized);

    if (yearMonth) {
      return yearMonth;
    }

    const normalizedYear = normalizeYear(normalized);

    if (normalizedYear) {
      return normalizedYear;
    }

    return null;
  }

  //
  // DD-MM-YYYY
  //
  match = normalized.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);

  if (match) {
    const day = match[1];
    const month = match[2];
    const year = match[3];

    if (day !== undefined && month !== undefined && year !== undefined) {
      const yearMonth = normalizeYearMonth(`${year}-${month}`);

      if (yearMonth && isValidDay(day)) {
        return `${yearMonth}-${pad2(Number(day))}`;
      }
    }

    return null;
  }

  //
  // DD Month YYYY
  //
  match = normalized.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);

  if (match) {
    const day = match[1];
    const monthName = match[2];
    const year = match[3];

    if (day !== undefined && monthName !== undefined && year !== undefined) {
      const yearMonth = normalizeYearMonth(`${monthName} ${year}`);

      if (yearMonth && isValidDay(day)) {
        return `${yearMonth}-${pad2(Number(day))}`;
      }
    }
  }

  const normalizedYearMonth = normalizeYearMonth(normalized);

  if (normalizedYearMonth) {
    return normalizedYearMonth;
  }

  const normalizedYear = normalizeYear(normalized);

  if (normalizedYear) {
    return normalizedYear;
  }

  return null;
}
