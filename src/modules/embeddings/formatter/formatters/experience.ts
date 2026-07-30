import { ChunkType, type ResumeChunk } from "../../types.js";
import type { Formatter } from "../types.js";

export const formatExperience: Formatter = (resume): ResumeChunk[] => {
  return resume.experience.map((experience, index): ResumeChunk => {
    const lines: string[] = [];

    lines.push(`Company: ${experience.company}`);
    lines.push(`Job Title: ${experience.jobTitle}`);
    lines.push(`Employment Type: ${experience.employmentType}`);

    if (experience.location) {
      const location = [
        experience.location.city,
        experience.location.state,
        experience.location.country,
      ]
        .filter(Boolean)
        .join(", ");

      if (location) {
        lines.push(`Location: ${location}`);
      }
    }

    lines.push(`Start Date: ${experience.startDate}`);

    if (experience.isCurrent) {
      lines.push("End Date: Present");
    } else if (experience.endDate) {
      lines.push(`End Date: ${experience.endDate}`);
    }

    if (experience.description) {
      lines.push(`Description: ${experience.description}`);
    }

    if (experience.responsibilities.length > 0) {
      lines.push(
        `Responsibilities: ${experience.responsibilities.join(", ")}`
      );
    }

    if (experience.achievements.length > 0) {
      lines.push(`Achievements: ${experience.achievements.join(", ")}`);
    }

    if (experience.technologies.length > 0) {
      lines.push(`Technologies: ${experience.technologies.join(", ")}`);
    }

    if (experience.domain.length > 0) {
      lines.push(`Domain: ${experience.domain.join(", ")}`);
    }

    return {
      chunkType: ChunkType.EXPERIENCE,
      chunkIndex: index,
      chunkContent: `EXPERIENCE

${lines.join("\n")}`,
    };
  });
}