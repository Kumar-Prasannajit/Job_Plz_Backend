/**
 * ============================================================================
 * URL Utilities
 * ============================================================================
 * Shared helper functions for URL normalization.
 *
 * Design Principles:
 * - Pure functions
 * - Null-safe
 * - Never throw
 * - Always return a normalized URL or empty string
 * ============================================================================
 */

import { normalizeString, toLowerCaseSafe } from "./string.utils.js";

/**
 * Checks whether a string is a valid absolute URL.
 *
 * @example
 * isAbsoluteUrl("https://github.com")
 * // true
 *
 * isAbsoluteUrl("github.com")
 * // false
 */
export function isAbsoluteUrl(url?: string | null): boolean {
  const normalized = normalizeString(url);

  if (!normalized) {
    return false;
  }

  try {
    const parsed = new URL(normalized);

    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Adds https:// if the protocol is missing.
 *
 * @example
 * ensureHttps("github.com/user")
 * // "https://github.com/user"
 */
export function ensureHttps(url?: string | null): string {
  const normalized = normalizeString(url);

  if (!normalized) {
    return "";
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return `https://${normalized}`;
}

/**
 * Removes trailing slash.
 *
 * @example
 * https://github.com/user/
 *
 * ->
 *
 * https://github.com/user
 */
export function removeTrailingSlash(url?: string | null): string {
  const normalized = normalizeString(url);

  if (!normalized) {
    return "";
  }

  return normalized.replace(/\/+$/, "");
}

/**
 * Removes URL fragments (#section).
 *
 * @example
 * https://example.com/about#team
 *
 * ->
 *
 * https://example.com/about
 */
export function removeUrlFragment(url?: string | null): string {
  const normalized = normalizeString(url);

  if (!normalized) {
    return "";
  }

  try {
    const parsed = new URL(normalized);

    parsed.hash = "";

    return parsed.toString();
  } catch {
    return normalized;
  }
}

/**
 * Removes common tracking query parameters.
 *
 * Removes:
 * - utm_source
 * - utm_medium
 * - utm_campaign
 * - utm_term
 * - utm_content
 */
export function removeTrackingParameters(
  url?: string | null
): string {
  const normalized = normalizeString(url);

  if (!normalized) {
    return "";
  }

  try {
    const parsed = new URL(normalized);

    const tracking = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];

    tracking.forEach((key) => parsed.searchParams.delete(key));

    return parsed.toString();
  } catch {
    return normalized;
  }
}

/**
 * Converts hostname to lowercase.
 *
 * Example:
 *
 * HTTPS://GitHub.COM/User
 *
 * ->
 *
 * https://github.com/User
 */
export function normalizeHostname(
  url?: string | null
): string {
  const normalized = normalizeString(url);

  if (!normalized) {
    return "";
  }

  try {
    const parsed = new URL(normalized);

    parsed.hostname = parsed.hostname.toLowerCase();

    return parsed.toString();
  } catch {
    return normalized;
  }
}

/**
 * Complete URL normalization.
 *
 * Steps:
 * - Trim
 * - Add https:// if missing
 * - Lowercase hostname
 * - Remove tracking parameters
 * - Remove fragment
 * - Remove trailing slash
 */
export function normalizeUrl(
  url?: string | null
): string {
  let normalized = normalizeString(url);

  if (!normalized) {
    return "";
  }

  normalized = ensureHttps(normalized);
  normalized = normalizeHostname(normalized);
  normalized = removeTrackingParameters(normalized);
  normalized = removeUrlFragment(normalized);
  normalized = removeTrailingSlash(normalized);

  return normalized;
}

/**
 * Returns the hostname.
 *
 * @example
 * https://github.com/user
 *
 * ->
 *
 * github.com
 */
export function getHostname(
  url?: string | null
): string {
  const normalized = normalizeUrl(url);

  if (!normalized) {
    return "";
  }

  try {
    return new URL(normalized).hostname;
  } catch {
    return "";
  }
}

/**
 * Checks if the URL belongs to a specific domain.
 *
 * @example
 * isDomain(url, "github.com")
 */
export function isDomain(
  url: string | null | undefined,
  domain: string
): boolean {
  return getHostname(url) === toLowerCaseSafe(domain);
}