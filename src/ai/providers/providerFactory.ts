import { GeminiProvider } from "./gemini.provider.js";
import type { AIProvider } from "./aiProvider.js";

export class ProviderFactory {
  static create(): AIProvider {
    return new GeminiProvider();
  }
}