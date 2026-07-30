import { isBlank, normalizeString } from "../utils/string.utils.js";

/**
 * Represents a string enum or enum-like object.
 *
 * Example:
 *
 * enum EmploymentType {
 *   FULL_TIME = "full_time",
 *   PART_TIME = "part_time"
 * }
 */
export type EnumLike = Record<string, string>;

/**
 * Cached enum value lookups.
 *
 * WeakMap ensures:
 * - O(1) repeated lookups
 * - no memory leaks
 * - one cache per enum object
 */
const ENUM_VALUE_CACHE = new WeakMap<
  EnumLike,
  ReadonlySet<string>
>();

const NORMALIZED_ENUM_CACHE = new WeakMap<
  EnumLike,
  ReadonlyMap<string, string>
>();

/**
 * Returns a cached Set containing all enum values.
 */
function getEnumValueSet(
  enumObject: EnumLike
): ReadonlySet<string> {
  let cache = ENUM_VALUE_CACHE.get(enumObject);

  if (!cache) {
    cache = new Set(Object.values(enumObject));

    ENUM_VALUE_CACHE.set(enumObject, cache);
  }

  return cache;
}

/**
 * Returns a cached lookup map where every enum value
 * is normalized for case-insensitive comparisons.
 *
 * Example:
 *
 * FULL_TIME
 * full_time
 * Full_Time
 *
 * all point to:
 *
 * full_time
 */
function getNormalizedEnumLookup(
  enumObject: EnumLike
): ReadonlyMap<string, string> {
  let cache = NORMALIZED_ENUM_CACHE.get(enumObject);

  if (!cache) {
    const lookup = new Map<string, string>();

    for (const [key, value] of Object.entries(enumObject)) {
      lookup.set(normalizeString(key).toLowerCase(), value);
      lookup.set(normalizeString(value).toLowerCase(), value);
    }

    cache = lookup;

    NORMALIZED_ENUM_CACHE.set(enumObject, cache);
  }

  return cache;
}

/**
 * Returns every enum value.
 *
 * Useful for:
 *
 * - dropdowns
 * - validation
 * - documentation
 * - API metadata
 */
/**
 * Cached enum values.
 *
 * Prevents allocating a new array every time
 * getEnumValues() is called.
 */
const ENUM_VALUES_CACHE = new WeakMap<
  EnumLike,
  readonly string[]
>();

export function getEnumValues<TEnum extends EnumLike>(
  enumObject: TEnum
): readonly TEnum[keyof TEnum][] {
  let cache = ENUM_VALUES_CACHE.get(enumObject) as
    | readonly TEnum[keyof TEnum][]
    | undefined;

  if (cache === undefined) {
    cache = Object.freeze(
      Object.values(enumObject)
    ) as readonly TEnum[keyof TEnum][];

    ENUM_VALUES_CACHE.set(enumObject, cache);
  }

  return cache;
}

/**
 * Returns true if a value already exists
 * in the enum.
 *
 * Comparison is exact.
 */
export function isEnumValue<TEnum extends EnumLike>(
  value: unknown,
  enumObject: TEnum
): value is TEnum[keyof TEnum] {
  if (typeof value !== "string") {
    return false;
  }

  return getEnumValueSet(enumObject).has(value);
}

/**
 * Normalizes a value to its canonical enum value.
 *
 * Comparison is:
 * - case-insensitive
 * - whitespace-insensitive
 *
 * Examples:
 *
 * "FULL_TIME"
 * "full_time"
 * " Full_Time "
 *
 * ->
 *
 * "full_time"
 *
 * Returns null if no match exists.
 */
export function normalizeEnumValue<TEnum extends EnumLike>(
  value: string | null | undefined,
  enumObject: TEnum
): TEnum[keyof TEnum] | null {
  if (typeof value !== "string") {
    return null;
  }

  if (isBlank(value)) {
    return null;
  }

  const lookup = getNormalizedEnumLookup(enumObject);

  const normalizedKey = normalizeString(value).toLowerCase();

  return (lookup.get(normalizedKey) as TEnum[keyof TEnum] | undefined) ?? null;
}

/**
 * Parses a value into an enum.
 *
 * If the value cannot be matched,
 * the provided fallback is returned.
 *
 * Examples:
 *
 * parseEnumValue(
 *   "FULL_TIME",
 *   EmploymentType,
 *   EmploymentType.CONTRACT
 * )
 *
 * ->
 *
 * EmploymentType.FULL_TIME
 */
export function parseEnumValue<TEnum extends EnumLike>(
  value: string | null | undefined,
  enumObject: TEnum,
  fallback: TEnum[keyof TEnum]
): TEnum[keyof TEnum] {
  return normalizeEnumValue(value, enumObject) ?? fallback;
}

/**
 * Compares two values after normalizing them
 * against the supplied enum.
 *
 * Returns true if both resolve to the same
 * canonical enum value.
 *
 * Examples:
 *
 * enumEquals(
 *   "FULL_TIME",
 *   "full_time",
 *   EmploymentType
 * )
 *
 * -> true
 *
 * enumEquals(
 *   "contract",
 *   "intern",
 *   EmploymentType
 * )
 *
 * -> false
 */
export function enumEquals<TEnum extends EnumLike>(
  first: string | null | undefined,
  second: string | null | undefined,
  enumObject: TEnum
): boolean {
  const normalizedFirst = normalizeEnumValue(first, enumObject);
  const normalizedSecond = normalizeEnumValue(second, enumObject);

  if (normalizedFirst === null || normalizedSecond === null) {
    return false;
  }

  return normalizedFirst === normalizedSecond;
}