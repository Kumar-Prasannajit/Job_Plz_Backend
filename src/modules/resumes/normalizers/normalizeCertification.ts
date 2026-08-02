import type { Certification } from "../schemas/canonicalResume.schema.js";

import { normalizeDate } from "./utils/date.utils.js";
import { deepRemoveNullish } from "./utils/object.utils.js";
import { normalizeString } from "./utils/string.utils.js";
import { normalizeTechnologyArray } from "./utils/technology.utils.js";
import { normalizeUrl } from "./utils/url.utils.js";

export function normalizeCertification(
  certifications: Certification[],
): Certification[] {
  return certifications.map(
    (certification) =>
      deepRemoveNullish({
        name: normalizeString(certification.name),

        issuingOrganization: normalizeString(certification.issuingOrganization),

        issueDate: normalizeDate(certification.issueDate),

        expiryDate: normalizeDate(certification.expiryDate),

        credentialId: normalizeString(certification.credentialId),

        credentialUrl: normalizeUrl(certification.credentialUrl),

        skills: normalizeTechnologyArray(certification.skills),
      }) as Certification,
  );
}
