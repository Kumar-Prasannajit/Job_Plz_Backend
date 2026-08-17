import { GoogleGenAI } from "@google/genai";

import { env } from "../../config/env.js";
import type { AIProvider } from "./aiProvider.js";

export class GeminiProvider implements AIProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  async extractResume(
    rawResume: string,
    prompt: string,
  ): Promise<Record<string, unknown>> {

    console.log("===== GEMINI DEBUG =====");
console.log("MODEL:", env.GEMINI_MODEL);
console.log(
  "KEY PREFIX:",
  env.GEMINI_API_KEY?.slice(0, 10),
);
console.log("========================");
    if (!prompt) {
      throw new Error("❌ Prompt is empty.");
    }

    if (!rawResume) {
      throw new Error("❌ Resume text is empty.");
    }

    const response = await this.client.models.generateContent({
      model: env.GEMINI_MODEL,

      contents: `${prompt}

Resume:

${rawResume}`,

      config: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("❌ Gemini returned an empty response.");
    }

    return JSON.parse(text) as Record<string, unknown>;
  }
}