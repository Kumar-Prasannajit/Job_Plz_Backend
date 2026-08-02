import type { Personal } from "../schemas/canonicalResume.schema.js";

import { normalizeEmail } from "./utils/email.utils.js";
import { deepRemoveNullish } from "./utils/object.utils.js";
import { normalizePhone } from "./utils/phone.utils.js";
import { normalizeString } from "./utils/string.utils.js";
import { normalizeUrl } from "./utils/url.utils.js";

export function normalizePersonal(personal: Personal): Personal {
  return deepRemoveNullish({
    fullName: normalizeString(personal.fullName),

    firstName: normalizeString(personal.firstName),

    lastName: normalizeString(personal.lastName),

    jobTitle: normalizeString(personal.jobTitle),

    email: normalizeEmail(personal.email),

    phone: normalizePhone(personal.phone),

    location: personal.location
      ? deepRemoveNullish({
          city: normalizeString(personal.location.city),

          state: normalizeString(personal.location.state),

          country: normalizeString(personal.location.country),
        })
      : undefined,

    linkedIn: normalizeUrl(personal.linkedIn),

    github: normalizeUrl(personal.github),

    portfolio: normalizeUrl(personal.portfolio),

    website: normalizeUrl(personal.website),

    leetcode: normalizeUrl(personal.leetcode),

    hackerrank: normalizeUrl(personal.hackerrank),

    codeforces: normalizeUrl(personal.codeforces),

    codechef: normalizeUrl(personal.codechef),

    stackoverflow: normalizeUrl(personal.stackoverflow),
  }) as Personal;
}
