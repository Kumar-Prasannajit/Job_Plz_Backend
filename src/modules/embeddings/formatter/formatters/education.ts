import { ChunkType, type ResumeChunk } from "../../types.js";
import type { Formatter } from "../types.js";

export const formatEducation: Formatter = (resume): ResumeChunk[] => {
  return resume.education.map((education, index): ResumeChunk => {
    const lines: string[] = [];

    lines.push(`Institution: ${education.institution}`);
    lines.push(`Degree: ${education.degree}`);
    lines.push(`Education Level: ${education.educationLevel}`);

    if (education.fieldOfStudy) {
      lines.push(`Field of Study: ${education.fieldOfStudy}`);
    }

    if (education.startDate) {
      lines.push(`Start Date: ${education.startDate}`);
    }

    if (education.isCurrentlyStudying) {
      lines.push("End Date: Present");
    } else if (education.endDate) {
      lines.push(`End Date: ${education.endDate}`);
    }

    if (education.grade) {
      const grade = [
        education.grade.value,
        education.grade.type,
      ]
        .filter(Boolean)
        .join(" ");

      if (grade) {
        lines.push(`Grade: ${grade}`);
      }
    }

    if (education.location) {
      const location = [
        education.location.city,
        education.location.state,
        education.location.country,
      ]
        .filter(Boolean)
        .join(", ");

      if (location) {
        lines.push(`Location: ${location}`);
      }
    }

    if (education.achievements.length > 0) {
      lines.push(`Achievements: ${education.achievements.join(", ")}`);
    }

    if (education.coursework.length > 0) {
      lines.push(`Coursework: ${education.coursework.join(", ")}`);
    }

    return {
      chunkType: ChunkType.EDUCATION,
      chunkIndex: index,
      chunkContent: `EDUCATION

${lines.join("\n")}`,
    };
  });
};