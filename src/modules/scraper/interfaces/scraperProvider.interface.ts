import type { RawJob } from "../types/rawJob.types.js";

export interface ScraperProvider {
  readonly id: string;

  readonly name: string;

  scrape(): Promise<RawJob[]>;
}