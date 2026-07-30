import { ChunkType, type ResumeChunk } from "../../types.js";
import type { Formatter } from "../types.js";

export const formatLanguages: Formatter = (resume): ResumeChunk[] => {
  return resume.languages.map((language, index): ResumeChunk => {
    return {
      chunkType: ChunkType.LANGUAGE,
      chunkIndex: index,
      chunkContent: `LANGUAGE

Language: ${language.language}
Proficiency: ${language.proficiency}`,
    };
  });
};