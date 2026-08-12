import type { RawJob } from "@prisma/client";

import type { CanonicalJob } from "../../schemas/canonicalJob.schema.js";
import type { JobCanonicalProvider } from "../../interfaces/jobCannonicalProvider.interface.js";

import { googleSectionExtractor } from "../../../scraper/providers/google/googleSectionExtractor.js";
import { googleCanonicalMapper } from "../../../scraper/providers/google/googleCanonicalMapper.js";

class GoogleCanonicalProvider implements JobCanonicalProvider {
  readonly providerId = "Google Careers";

  async map(rawJob: RawJob): Promise<CanonicalJob> {
    const sections = googleSectionExtractor.extract(rawJob.rawText);

    return googleCanonicalMapper.toCanonicalJob(sections, rawJob);
  }
}

export const googleCanonicalProvider = new GoogleCanonicalProvider();
