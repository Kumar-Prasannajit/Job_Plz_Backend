import type { CanonicalResume } from "../schemas/canonicalResume.schema.js";

export interface UploadResumeResponse {
  resumeId: string;
  data: CanonicalResume;
}

export interface UpdateResumeRequest {
  resumeId: string;
  data: CanonicalResume;
}

export interface UpdateResumeResponse {
  resumeId: string;
  data: CanonicalResume;
}

export interface FinalizeResumeRequest {
  resumeId: string;
  userId: string;
}

export interface FinalizeResumeResponse {
  resumeId: string;
  chunks: number;
  embeddingDimension: number;
  embeddingsGenerated: boolean;
}