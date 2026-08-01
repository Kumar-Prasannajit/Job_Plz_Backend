import type { CanonicalResume } from "../../resumes/schemas/canonicalResume.schema.js";
import type { ResumeChunk } from "../types.js";

export type Formatter = (resume: CanonicalResume) => ResumeChunk[]; 