import type { Project } from "../schemas/canonicalResume.schema.js";

import { cleanStringArray } from "../normalizers/utils/array.utils.js";
import { normalizeDate } from "../normalizers/utils/date.utils.js";
import { deepRemoveNullish } from "../normalizers/utils/object.utils.js";
import { normalizeString } from "../normalizers/utils/string.utils.js";
import { normalizeTechnologyArray } from "../normalizers/utils/technology.utils.js";
import { normalizeUrl } from "../normalizers/utils/url.utils.js";

export function normalizeProjects(
  projects: Project[],
): Project[] {
  return projects.map((project) =>
    deepRemoveNullish({
      title: normalizeString(
        project.title,
      ),

      description: normalizeString(
        project.description,
      ),

      role: normalizeString(
        project.role,
      ),

      organization: normalizeString(
        project.organization,
      ),

      startDate: normalizeDate(
        project.startDate,
      ),

      endDate: normalizeDate(
        project.endDate,
      ),

      isOngoing: project.isOngoing,

      technologies:
        normalizeTechnologyArray(
          project.technologies,
        ),

      domain: cleanStringArray(
        project.domain,
      ),

      responsibilities:
        cleanStringArray(
          project.responsibilities,
        ),

      achievements:
        cleanStringArray(
          project.achievements,
        ),

      githubUrl: normalizeUrl(
        project.githubUrl,
      ),

      liveUrl: normalizeUrl(
        project.liveUrl,
      ),

      demoUrl: normalizeUrl(
        project.demoUrl,
      ),
    }) as Project,
  );
}