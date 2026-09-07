/**
 * ============================================================================
 * Phone Utilities
 * ============================================================================
 * Shared helper functions for phone normalization and validation.
 *
 * Design Principles:
 * - Pure functions
 * - Null-safe
 * - Never throw
 * - Library encapsulation
 * ============================================================================
 */

import {
  parsePhoneNumberFromString,
  type CountryCode,
  type PhoneNumber,
} from "libphonenumber-js";

import { normalizeString } from "./string.utils.js";

/**
 * Default country.
 *
 * Used when parsing national phone numbers without a country code.
 * Can be changed later from configuration if required.
 */
const DEFAULT_COUNTRY: CountryCode = "IN";

/**
 * Internal helper.
 *
 * Safely parses a phone number.
 */
function parsePhone(
  phone?: string | null,
  defaultCountry: CountryCode = DEFAULT_COUNTRY
): PhoneNumber | null {
  const normalized = normalizeString(phone);

  if (!normalized) {
    return null;
  }

  try {
    return (
      parsePhoneNumberFromString(normalized, defaultCountry) ??
      null
    );
  } catch {
    return null;
  }
}

/**
 * Normalizes a phone number into E.164 format.
 *
 * @example
 * normalizePhone("+91 98765-43210")
 * // "+919876543210"
 *
 * normalizePhone("9876543210")
 * // "+919876543210"
 */
export function normalizePhone(
  phone?: string | null,
  defaultCountry: CountryCode = DEFAULT_COUNTRY
): string {
  const parsed = parsePhone(phone, defaultCountry);

  if (!parsed) {
    return "";
  }

  return parsed.number;
}

/**
 * Removes all formatting and returns only digits.
 *
 * @example
 * "+91 98765-43210"
 *
 * ->
 *
 * "919876543210"
 */
export function stripPhoneFormatting(
  phone?: string | null,
  defaultCountry: CountryCode = DEFAULT_COUNTRY
): string {
  return normalizePhone(phone, defaultCountry).replace(/\D/g, "");
}

/**
 * Returns whether the phone number is valid.
 */
export function isValidPhoneFormat(
  phone?: string | null,
  defaultCountry: CountryCode = DEFAULT_COUNTRY
): boolean {
  const parsed = parsePhone(phone, defaultCountry);

  return parsed?.isValid() ?? false;
}

/**
 * Returns the detected country.
 *
 * @example
 * "+919876543210"
 *
 * ->
 *
 * "IN"
 */
export function getCountryCode(
  phone?: string | null,
  defaultCountry: CountryCode = DEFAULT_COUNTRY
): string {
  const parsed = parsePhone(phone, defaultCountry);

  return parsed?.country ?? "";
}

/**
 * Returns the national number.
 *
 * @example
 *
 * +919876543210
 *
 * ->
 *
 * 9876543210
 */
export function getNationalNumber(
  phone?: string | null,
  defaultCountry: CountryCode = DEFAULT_COUNTRY
): string {
  const parsed = parsePhone(phone, defaultCountry);

  return parsed?.nationalNumber ?? "";
}

/**
 * Checks whether two phone numbers are equivalent.
 *
 * @example
 *
 * "+91 9876543210"
 *
 * and
 *
 * "9876543210"
 *
 * ->
 *
 * true
 */
export function phoneEquals(
  phone1?: string | null,
  phone2?: string | null,
  defaultCountry: CountryCode = DEFAULT_COUNTRY
): boolean {
  return (
    normalizePhone(phone1, defaultCountry) ===
    normalizePhone(phone2, defaultCountry)
  );
}

/**
 * Masks a phone number for logs.
 *
 * Example
 *
 * +919876543210
 *
 * ->
 *
 * +9198******10
 */
export function maskPhone(
  phone?: string | null,
  defaultCountry: CountryCode = DEFAULT_COUNTRY
): string {
  const normalized = normalizePhone(phone, defaultCountry);

  if (!normalized) {
    return "";
  }

  const digits = normalized.replace(/\D/g, "");

  if (digits.length <= 4) {
    return normalized;
  }

  const visiblePrefix = digits.slice(0, 2);
  const visibleSuffix = digits.slice(-2);

  const maskedDigits =
    visiblePrefix +
    "*".repeat(digits.length - 4) +
    visibleSuffix;

  if (normalized.startsWith("+")) {
    const countryDigits = digits.length - getNationalNumber(phone, defaultCountry).length;

    return (
      "+" +
      digits.slice(0, countryDigits) +
      maskedDigits.slice(countryDigits)
    );
  }

  return maskedDigits;
}