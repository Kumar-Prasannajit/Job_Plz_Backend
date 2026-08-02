import {
  CanonicalJobSchema,
  type CanonicalJob,
} from "../schemas/canonicalJob.schema.js";

import { jobGeminiProvider } from "../providers/jobGemini.provider.js";

class JobExtractorService {
  async extract(rawJob: string): Promise<CanonicalJob> {
    const extracted = await jobGeminiProvider.extractJob(rawJob);

    return CanonicalJobSchema.parse(extracted);
  }
}

export const jobExtractorService = new JobExtractorService();