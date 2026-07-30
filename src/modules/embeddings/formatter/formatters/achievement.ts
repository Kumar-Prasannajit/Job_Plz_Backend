import { ChunkType, type ResumeChunk } from "../../types.js";
import type { Formatter } from "../types.js";

export const formatAchievements: Formatter = (resume): ResumeChunk[] => {
  return resume.achievements.map((achievement, index): ResumeChunk => {
    const lines: string[] = [];

    lines.push(`Title: ${achievement.title}`);

    if (achievement.description) {
      lines.push(`Description: ${achievement.description}`);
    }

    if (achievement.organization) {
      lines.push(`Organization: ${achievement.organization}`);
    }

    if (achievement.date) {
      lines.push(`Date: ${achievement.date}`);
    }

    return {
      chunkType: ChunkType.ACHIEVEMENT,
      chunkIndex: index,
      chunkContent: `ACHIEVEMENT

${lines.join("\n")}`,
    };
  });
};