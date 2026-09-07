/**
 * ============================================================================
 * Email Utilities
 * ============================================================================
 * Shared helper functions for email normalization and validation.
 *
 * Design Principles:
 * - Pure functions
 * - Null-safe
 * - Never throw
 * - Separation of normalization and validation
 * ============================================================================
 */

import { normalizeString } from "./string.utils.js";

/**
 * Practical email validation pattern.
 *
 * Designed for user input validation rather than full RFC 5322 compliance.
 */
export const EMAIL_REGEX =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

/**
 * Internal helper.
 *
 * Assumes the email has already been normalized.
 */
function isNormalizedEmailValid(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Normalizes an email address.
 *
 * Operations:
 * - Trim whitespace
 * - Remove internal whitespace
 * - Convert to lowercase
 *
 * @example
 * normalizeEmail("  JOHN.DOE@GMAIL.COM ")
 * // "john.doe@gmail.com"
 */
export function normalizeEmail(email?: string | null): string {
  return normalizeString(email).replace(/\s+/g, "").toLowerCase();
}

/**
 * Returns true if the email has a valid format.
 *
 * @example
 * isValidEmailFormat("john@gmail.com")
 * // true
 */
export function isValidEmailFormat(email?: string | null): boolean {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return false;
  }

  return isNormalizedEmailValid(normalized);
}

function parseNormalizedEmail(email: string): {
  username: string;
  domain: string;
} {
  const [username = "", domain = ""] = email.split("@");

  return { username, domain };
}

/**
 * Returns the domain portion of an email.
 *
 * @example
 * getEmailDomain("john@gmail.com")
 * // "gmail.com"
 */
export function getEmailDomain(email?: string | null): string {
  const normalized = normalizeEmail(email);

if (!isNormalizedEmailValid(normalized)) {
  return "";
}

return parseNormalizedEmail(normalized).domain;
}

/**
 * Returns the username (local part) of an email.
 *
 * @example
 * getEmailUsername("john@gmail.com")
 * // "john"
 */
export function getEmailUsername(email?: string | null): string {
  const normalized = normalizeEmail(email);

if (!isNormalizedEmailValid(normalized)) {
  return "";
}

return parseNormalizedEmail(normalized).username;
}

/**
 * Checks whether an email belongs to a specific domain.
 *
 * @example
 * isEmailFromDomain(
 *   "john@gmail.com",
 *   "gmail.com"
 * )
 * // true
 */
export function isEmailFromDomain(
  email: string | null | undefined,
  domain: string,
): boolean {
  return getEmailDomain(email) === normalizeString(domain).toLowerCase();
}

/**
 * Checks whether two email addresses are equivalent.
 *
 * Comparison is case-insensitive and whitespace-insensitive.
 *
 * @example
 * emailEquals(
 *   " JOHN@gmail.com ",
 *   "john@gmail.com"
 * )
 * // true
 */
export function emailEquals(
  email1?: string | null,
  email2?: string | null,
): boolean {
  return normalizeEmail(email1) === normalizeEmail(email2);
}

/**
 * Masks an email for logging or debugging.
 *
 * Examples:
 *
 * john@gmail.com
 * -> j***@gmail.com
 *
 * ab@gmail.com
 * -> a*@gmail.com
 *
 * a@gmail.com
 * -> a@gmail.com
 */
export function maskEmail(email?: string | null): string {
const normalized = normalizeEmail(email);

if (!isNormalizedEmailValid(normalized)) {
  return "";
}

const { username, domain } = parseNormalizedEmail(normalized);

if (username.length === 1) {
  return normalized;
}

if (username.length === 2) {
  return `${username[0]}*@${domain}`;
}

return `${username[0]}${"*".repeat(username.length - 1)}@${domain}`;
}
