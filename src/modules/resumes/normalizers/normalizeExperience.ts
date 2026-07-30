import type { Experience } from "../schemas/canonicalResume.schema.js";

import { cleanStringArray } from "../normalizers/utils/array.utils.js";
import { normalizeDate } from "../normalizers/utils/date.utils.js";
import { deepRemoveNullish } from "../normalizers/utils/object.utils.js";
import { normalizeString } from "../normalizers/utils/string.utils.js";
import { normalizeTechnologyArray } from "../normalizers/utils/technology.utils.js";

export function normalizeExperience(
  experiences: Experience[],
): Experience[] {
  return experiences.map((experience) =>
    deepRemoveNullish({
      company: normalizeString(
        experience.company,
      ),

      jobTitle: normalizeString(
        experience.jobTitle,
      ),

      employmentType:
        experience.employmentType,

      location: experience.location
        ? deepRemoveNullish({
            city: normalizeString(
              experience.location.city,
            ),

            state: normalizeString(
              experience.location.state,
            ),

            country: normalizeString(
              experience.location.country,
            ),
          })
        : undefined,
        

      startDate: normalizeDate(
        experience.startDate,
      ),

      endDate: normalizeDate(
        experience.endDate,
      ),

      isCurrent:
        experience.isCurrent,

      description: normalizeString(
        experience.description,
      ),

      responsibilities:
        cleanStringArray(
          experience.responsibilities,
        ),

      achievements:
        cleanStringArray(
          experience.achievements,
        ),

      technologies:
        normalizeTechnologyArray(
          experience.technologies,
        ),

      domain:
        cleanStringArray(
          experience.domain,
        ),
    }) as Experience,
  );
}