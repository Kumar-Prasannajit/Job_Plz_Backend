import { ChunkType, type ResumeChunk } from "../../types.js";
import type { Formatter } from "../types.js";

export const formatSummary: Formatter = (resume): ResumeChunk[] => {
  const summary = resume.summary.trim();

  if (!summary) {
    return [];
  }

  return [
    {
      chunkType: ChunkType.SUMMARY,
      chunkIndex: 0,
      chunkContent: `SUMMARY

${summary}`,
    },
  ];
};