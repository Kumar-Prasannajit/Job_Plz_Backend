import type { RawJob } from "../../types/rawJob.types.js";
import type { ScraperProvider } from "../../interfaces/scraperProvider.interface.js";

import { browserService } from "../../browser/browser.service.js";

import { googleSearch } from "./google.search.js";
import { googleList } from "./google.list.js";
import { googleDetails } from "./google.details.js";
import { googleMapper } from "./google.mapper.js";

class GoogleProvider implements ScraperProvider {
  readonly id = "google";

  readonly name = "Google Careers";

  async scrape(): Promise<RawJob[]> {
    const session = await browserService.launch({
      headless: true,
      timeout: 60_000,
    });

    const { page } = session;

    try {
      await googleSearch.prepare(page);

      const listings = await googleList.discover(page);

      const jobs: RawJob[] = [];

      for (const listing of listings) {
        try {
          const detail = await googleDetails.extract(
            page,
            listing,
          );

          const rawJob = googleMapper.toRawJob(
            listing,
            detail,
          );

          jobs.push(rawJob);
        } catch (error) {
          console.error(
            `Failed to scrape Google job ${listing.platformJobId}`,
          );

          console.error(error);
        }
      }

      return jobs;
    } finally {
      await browserService.close(session);
    }
  }
}

export const googleProvider = new GoogleProvider();