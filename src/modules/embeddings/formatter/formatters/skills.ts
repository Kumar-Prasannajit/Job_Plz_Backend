import { ChunkType, type ResumeChunk } from "../../types.js";
import type { Formatter } from "../types.js";

export const formatSkills: Formatter = (resume): ResumeChunk[] => {
  const lines: string[] = [];

  const addCategory = (label: string, skills: string[]) => {
    if (skills.length > 0) {
      lines.push(`${label}: ${skills.join(", ")}`);
    }
  };

  addCategory("Languages", resume.skills.languages);
  addCategory("Frontend", resume.skills.frontend);
  addCategory("Backend", resume.skills.backend);
  addCategory("Database", resume.skills.database);
  addCategory("Cloud", resume.skills.cloud);
  addCategory("DevOps", resume.skills.devops);
  addCategory("Testing", resume.skills.testing);
  addCategory("AI", resume.skills.ai);
  addCategory("Operating Systems", resume.skills.operatingSystems);
  addCategory("Mobile", resume.skills.mobile);
  addCategory("Tools", resume.skills.tools);
  addCategory("Soft Skills", resume.skills.softSkills);
  addCategory("Miscellaneous", resume.skills.miscellaneous);

  if (lines.length === 0) {
    return [];
  }

  return [
    {
      chunkType: ChunkType.SKILLS,
      chunkIndex: 0,
      chunkContent: `SKILLS

${lines.join("\n")}`,
    },
  ];
};