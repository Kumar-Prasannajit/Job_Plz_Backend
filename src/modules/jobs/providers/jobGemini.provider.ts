import { GoogleGenAI } from "@google/genai";

import { env } from "../../../config/env.js";

import { JOB_EXTRACTION_PROMPT } from "../prompts/jobExtractor.prompt.js";

import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

export class JobGeminiProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  async extractJob(rawJob: string): Promise<CanonicalJob> {
    if (!rawJob) {
      throw new Error("❌ Job text is empty.");
    }

    const response = await this.client.models.generateContent({
      model: env.GEMINI_MODEL,

      contents: `${JOB_EXTRACTION_PROMPT}

Job Posting:

${rawJob}`,

      config: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("❌ Gemini returned an empty response.");
    }

    return JSON.parse(text) as CanonicalJob;
  }
}

export const jobGeminiProvider = new JobGeminiProvider();