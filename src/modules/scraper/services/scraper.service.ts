import type { ScraperProvider } from "../interfaces/scraperProvider.interface.js";

import { rawJobRepository } from "../repositories/rawJob.repository.js";

class ScraperService {
  async scrape(provider: ScraperProvider): Promise<number> {
    console.log(`Starting scraper: ${provider.name}`);

    const jobs = await provider.scrape();

    console.log(`Found ${jobs.length} jobs from ${provider.name}`);

    await rawJobRepository.createMany(jobs);

    console.log(`Saved ${jobs.length} raw jobs.`);

    return jobs.length;
  }
}

export const scraperService = new ScraperService();