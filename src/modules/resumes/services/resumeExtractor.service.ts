import { ProviderFactory } from "../../../ai/providers/providerFactory.js";

import { RESUME_EXTRACTION_SYSTEM_PROMPT } from "../prompts/resumeExtraction.prompt.js";

export class ResumeExtractorService {
  private provider = ProviderFactory.create();

  async extract(rawText: string) {
    return this.provider.extractResume(
      rawText,
      RESUME_EXTRACTION_SYSTEM_PROMPT,
    );
  }
}

export const resumeExtractorService = new ResumeExtractorService();
