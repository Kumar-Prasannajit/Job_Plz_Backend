import type { ScraperProvider } from "../interfaces/scraperProvider.interface.js";
import type { ScraperRunResult } from "../types/scraper.types.js";

import { rawJobRepository } from "../repositories/rawJob.repository.js";
import { jobProcessingProducer } from "../../../queues/job-processing.producer.js";

class ScraperService {
  async scrape(provider: ScraperProvider): Promise<ScraperRunResult> {
    const startedAt = new Date();

    console.log("\n========================================");
    console.log(`🚀 Starting ${provider.name} Scraper`);
    console.log("========================================\n");

    const jobs = await provider.scrape();

    console.log(`📥 ${provider.name}: ${jobs.length} job(s) scraped.`);

    const persistence = await rawJobRepository.createMany(jobs);

    console.log(
      `💾 Inserted ${persistence.inserted.length} new RawJob(s), skipped ${persistence.duplicates} duplicate(s).`,
    );
    console.log("📨 Queueing newly inserted jobs...");

    let processed = 0;
    let processingFailed = 0;

    for (const rawJob of persistence.inserted) {
      try {
        console.log(`📨 Queueing: ${rawJob.jobTitle}`);

        await jobProcessingProducer.enqueue(rawJob.id);

        await rawJobRepository.markQueued(rawJob.id);

        processed++;
      } catch (error) {
        processingFailed++;

        console.error(`❌ Failed queueing: ${rawJob.jobTitle}`);

        console.error(error);
      }
    }

    const completedAt = new Date();

    const result: ScraperRunResult = {
      provider: provider.name,

      startedAt,

      completedAt,

      durationMs: completedAt.getTime() - startedAt.getTime(),

      scraped: jobs.length,

      inserted: persistence.inserted.length,

      duplicates: persistence.duplicates,

      processed,

      failed: persistence.failed + processingFailed,
    };

    console.log("\n========================================");
    console.log("📊 Scraper Summary");
    console.log("========================================");
    console.table({
      ...result,

      startedAt: result.startedAt.toISOString(),

      completedAt: result.completedAt.toISOString(),

      durationMs: `${result.durationMs} ms`,
    });
    console.log("========================================\n");

    return result;
  }
}

export const scraperService = new ScraperService();
