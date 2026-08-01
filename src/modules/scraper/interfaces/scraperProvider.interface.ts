import type { RawJob } from "../types/rawJob.types.js";

export interface ScraperProvider {
  /**
   * Human-readable provider name.
   * Examples:
   * - "Google Careers"
   * - "LinkedIn"
   * - "Naukri"
   */
  readonly name: string;

  /**
   * Scrapes jobs from the provider.
   */
  scrape(): Promise<RawJob[]>;
}