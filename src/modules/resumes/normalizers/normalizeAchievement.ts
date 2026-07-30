import type { Achievement } from "../schemas/canonicalResume.schema.js";

import { normalizeDate } from "../normalizers/utils/date.utils.js";
import { deepRemoveNullish } from "../normalizers/utils/object.utils.js";
import { normalizeString } from "../normalizers/utils/string.utils.js";

export function normalizeAchievement(
  achievements: Achievement[],
): Achievement[] {
  return achievements.map((achievement) =>
    deepRemoveNullish({
      title: normalizeString(
        achievement.title,
      ),

      description: normalizeString(
        achievement.description,
      ),

      date: normalizeDate(
        achievement.date,
      ),

      organization: normalizeString(
        achievement.organization,
      ),
    }) as Achievement,
  );
}