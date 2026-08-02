import type { Education } from "../schemas/canonicalResume.schema.js";

import { cleanStringArray } from "./utils/array.utils.js";
import { normalizeDate } from "./utils/date.utils.js";
import { deepRemoveNullish } from "./utils/object.utils.js";
import { normalizeString } from "./utils/string.utils.js";

export function normalizeEducation(educations: Education[]): Education[] {
  return educations.map(
    (education) =>
      deepRemoveNullish({
        institution: normalizeString(education.institution),

        degree: normalizeString(education.degree),

        fieldOfStudy: normalizeString(education.fieldOfStudy),

        educationLevel: education.educationLevel,

        startDate: normalizeDate(education.startDate),

        endDate: normalizeDate(education.endDate),

        isCurrentlyStudying: education.isCurrentlyStudying,

        grade: education.grade
          ? deepRemoveNullish({
              value: normalizeString(education.grade.value),

              type: education.grade.type,

              maxValue: education.grade.maxValue,
            })
          : undefined,

        location: education.location
          ? deepRemoveNullish({
              city: normalizeString(education.location.city),

              state: normalizeString(education.location.state),

              country: normalizeString(education.location.country),
            })
          : undefined,

        achievements: cleanStringArray(education.achievements),

        coursework: cleanStringArray(education.coursework),
      }) as Education,
  );
}
