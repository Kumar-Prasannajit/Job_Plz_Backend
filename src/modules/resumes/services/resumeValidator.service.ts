import { ZodError } from "zod";

import {
  CanonicalResumeSchema,
  type CanonicalResume,
} from "../schemas/canonicalResume.schema.js";

class ResumeValidatorService {
  validate(data: unknown): CanonicalResume {
    return CanonicalResumeSchema.parse(data);
  }

  safeValidate(data: unknown) {
    return CanonicalResumeSchema.safeParse(data);
  }

  formatErrors(error: ZodError) {
    return error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }
}

export const resumeValidatorService = new ResumeValidatorService();