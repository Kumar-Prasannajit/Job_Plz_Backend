import type { Certification } from "../schemas/canonicalResume.schema.js";

import { normalizeDate } from "../normalizers/utils/date.utils.js";
import { deepRemoveNullish } from "../normalizers/utils/object.utils.js";
import { normalizeString } from "../normalizers/utils/string.utils.js";
import { normalizeTechnologyArray } from "../normalizers/utils/technology.utils.js";
import { normalizeUrl } from "../normalizers/utils/url.utils.js";

export function normalizeCertification(
  certifications: Certification[],
): Certification[] {
  return certifications.map(
    (certification) =>
      deepRemoveNullish({
        name: normalizeString(
          certification.name,
        ),

        issuingOrganization:
          normalizeString(
            certification.issuingOrganization,
          ),

        issueDate: normalizeDate(
          certification.issueDate,
        ),

        expiryDate: normalizeDate(
          certification.expiryDate,
        ),

        credentialId:
          normalizeString(
            certification.credentialId,
          ),

        credentialUrl:
          normalizeUrl(
            certification.credentialUrl,
          ),

        skills:
          normalizeTechnologyArray(
            certification.skills,
          ),
      }) as Certification,
  );
}