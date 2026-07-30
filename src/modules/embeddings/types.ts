export enum ChunkType {
  SUMMARY = "SUMMARY",
  SKILLS = "SKILLS",
  EXPERIENCE = "EXPERIENCE",
  PROJECT = "PROJECT",
  EDUCATION = "EDUCATION",
  CERTIFICATION = "CERTIFICATION",
  ACHIEVEMENT = "ACHIEVEMENT",
  LANGUAGE = "LANGUAGE",
}

export interface ResumeChunk {
  chunkType: ChunkType;
  chunkIndex: number;
  chunkContent: string;
  metadata?: Record<string, unknown>;
}