import type { RawJob as RawJobEntity } from "../../../db/schema.js";

export interface ScraperPersistenceResult<T> {
  inserted: T[];
  duplicates: number;
  failed: number;
}

export interface ScraperRunResult {
  provider: string;

  startedAt: Date;

  completedAt: Date;

  durationMs: number;

  scraped: number;

  inserted: number;

  duplicates: number;

  processed: number;

  failed: number;
}

export type RawJobPersistenceResult =
  ScraperPersistenceResult<RawJobEntity>;