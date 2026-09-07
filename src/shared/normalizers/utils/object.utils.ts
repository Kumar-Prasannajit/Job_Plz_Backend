/**
 * Returns true if the supplied value is a plain JavaScript object.
 *
 * Excludes:
 * - null
 * - arrays
 * - dates
 * - maps
 * - sets
 * - class instances
 *
 * Examples:
 *
 * {}                     -> true
 * { a: 1 }               -> true
 * []                     -> false
 * null                   -> false
 * new Date()             -> false
 * new Map()              -> false
 */
export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  return Object.getPrototypeOf(value) === Object.prototype;
}

/**
 * Returns true if an object has no enumerable own properties.
 *
 * Non-objects always return false.
 *
 * Examples:
 *
 * {}            -> true
 * { a: 1 }      -> false
 * []            -> false
 * null          -> false
 */
export function isEmptyObject(
  value: unknown
): value is Record<string, never> {
  if (!isPlainObject(value)) {
    return false;
  }

  return Object.keys(value).length === 0;
}

/**
 * Safe wrapper around Object.prototype.hasOwnProperty.
 *
 * Works even if the object shadows hasOwnProperty.
 *
 * Examples:
 *
 * hasOwnPropertySafe(obj, "name")
 */
export function hasOwnPropertySafe<
  TObject extends object,
  TKey extends PropertyKey
>(
  object: TObject,
  key: TKey
): key is Extract<TKey, keyof TObject> {
  return Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * Deep freezes an object.
 *
 * Arrays and nested objects are recursively frozen.
 *
 * Primitive values are returned unchanged.
 *
 * This is useful for immutable configuration objects.
 */
export function deepFreeze<T>(value: T): Readonly<T> {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value as Readonly<T>;
  }

  Object.freeze(value);

  for (const property of Object.values(value)) {
    deepFreeze(property);
  }

  return value as Readonly<T>;
}

/**
 * Returns a shallow copy of an object with all properties whose value is
 * `undefined` removed.
 *
 * Examples:
 *
 * { a: 1, b: undefined }
 *
 * ->
 *
 * { a: 1 }
 */
export function removeUndefined<T extends Record<string, unknown>>(
  object: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(object) as [
    keyof T,
    T[keyof T],
  ][]) {
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Returns a shallow copy of an object with all properties whose value is
 * `null` removed.
 *
 * Examples:
 *
 * { a: 1, b: null }
 *
 * ->
 *
 * { a: 1 }
 */
export function removeNull<T extends Record<string, unknown>>(
  object: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(object) as [
    keyof T,
    T[keyof T],
  ][]) {
    if (value !== null) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Returns a shallow copy of an object with all `null` and `undefined`
 * properties removed.
 *
 * Examples:
 *
 * {
 *   a: 1,
 *   b: null,
 *   c: undefined,
 *   d: "hello"
 * }
 *
 * ->
 *
 * {
 *   a: 1,
 *   d: "hello"
 * }
 */
export function removeNullish<T extends Record<string, unknown>>(
  object: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(object) as [
    keyof T,
    T[keyof T],
  ][]) {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Recursively removes all `null` and `undefined` values from plain objects.
 *
 * Arrays are preserved, but each element is recursively cleaned.
 *
 * Primitive values are returned unchanged.
 *
 * Examples:
 *
 * {
 *   name: "John",
 *   age: null,
 *   address: {
 *     city: "Delhi",
 *     zip: undefined,
 *   }
 * }
 *
 * ->
 *
 * {
 *   name: "John",
 *   address: {
 *     city: "Delhi"
 *   }
 * }
 */
export function deepRemoveNullish<T>(value: T): T {
  if (Array.isArray(value)) {
    const cleanedArray = value
      .map((item) => deepRemoveNullish(item))
      .filter((item) => {
        if (item === null || item === undefined) {
          return false;
        }

        if (Array.isArray(item)) {
          return item.length > 0;
        }

        if (isPlainObject(item)) {
          return !isEmptyObject(item);
        }

        return true;
      });

    return cleanedArray as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const result: Record<string, unknown> = {};

  for (const [key, property] of Object.entries(value)) {
    if (property === null || property === undefined) {
      continue;
    }

    const cleaned = deepRemoveNullish(property);

    if (Array.isArray(cleaned)) {
      if (cleaned.length === 0) {
        continue;
      }

      result[key] = cleaned;
      continue;
    }

    if (isPlainObject(cleaned)) {
      if (isEmptyObject(cleaned)) {
        continue;
      }

      result[key] = cleaned;
      continue;
    }

    result[key] = cleaned;
  }

  return result as T;
}

/**
 * Creates a new object containing only the specified keys.
 *
 * Keys that do not exist on the object are ignored.
 *
 * Examples:
 *
 * const user = {
 *   name: "John",
 *   age: 25,
 *   city: "Delhi"
 * };
 *
 * pickKeys(user, ["name", "city"]);
 *
 * ->
 *
 * {
 *   name: "John",
 *   city: "Delhi"
 * }
 */
export function pickKeys<
  TObject extends Record<string, unknown>,
  TKey extends keyof TObject,
>(
  object: TObject,
  keys: readonly TKey[]
): Pick<TObject, TKey> {
  const result = {} as Pick<TObject, TKey>;

  for (const key of keys) {
    if (hasOwnPropertySafe(object, key)) {
      result[key] = object[key];
    }
  }

  return result;
}

/**
 * Creates a new object excluding the specified keys.
 *
 * Examples:
 *
 * const user = {
 *   name: "John",
 *   age: 25,
 *   password: "secret"
 * };
 *
 * omitKeys(user, ["password"]);
 *
 * ->
 *
 * {
 *   name: "John",
 *   age: 25
 * }
 */
export function omitKeys<
  TObject extends Record<string, unknown>,
  TKey extends keyof TObject,
>(
  object: TObject,
  keys: readonly TKey[]
): Omit<TObject, TKey> {
  const excluded = new Set<keyof TObject>(keys);

  const result: Partial<TObject> = {};

  for (const key in object) {
    if (
      hasOwnPropertySafe(object, key) &&
      !excluded.has(key)
    ) {
      result[key] = object[key];
    }
  }

  return result as Omit<TObject, TKey>;
}