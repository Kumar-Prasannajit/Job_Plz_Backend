import type { CanonicalResume } from "../resumes/schemas/canonicalResume.schema.js";

import type { ResumeChunk } from "./types.js";
import { formatResume } from "./formatter/resumeFormatter.js";

export class EmbeddingService {
  public format(resume: CanonicalResume): ResumeChunk[] {
    return formatResume(resume);
  }
}