import { ChunkType, type ResumeChunk } from "../../types.js";
import type { Formatter } from "../types.js";

export const formatProjects: Formatter = (resume): ResumeChunk[] => {
  return resume.projects.map((project, index): ResumeChunk => {
    const lines: string[] = [];

    lines.push(`Title: ${project.title}`);

    if (project.role) {
      lines.push(`Role: ${project.role}`);
    }

    if (project.organization) {
      lines.push(`Organization: ${project.organization}`);
    }

    if (project.description) {
      lines.push(`Description: ${project.description}`);
    }

    if (project.startDate) {
      lines.push(`Start Date: ${project.startDate}`);
    }

    if (project.isOngoing) {
      lines.push("End Date: Present");
    } else if (project.endDate) {
      lines.push(`End Date: ${project.endDate}`);
    }

    if (project.technologies.length > 0) {
      lines.push(`Technologies: ${project.technologies.join(", ")}`);
    }

    if (project.domain.length > 0) {
      lines.push(`Domain: ${project.domain.join(", ")}`);
    }

    if (project.responsibilities.length > 0) {
      lines.push(
        `Responsibilities: ${project.responsibilities.join(", ")}`
      );
    }

    if (project.achievements.length > 0) {
      lines.push(`Achievements: ${project.achievements.join(", ")}`);
    }

    if (project.githubUrl) {
      lines.push(`GitHub: ${project.githubUrl}`);
    }

    if (project.liveUrl) {
      lines.push(`Live URL: ${project.liveUrl}`);
    }

    if (project.demoUrl) {
      lines.push(`Demo URL: ${project.demoUrl}`);
    }

    return {
      chunkType: ChunkType.PROJECT,
      chunkIndex: index,
      chunkContent: `PROJECT

${lines.join("\n")}`,
    };
  });
};