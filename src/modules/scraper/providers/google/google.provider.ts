import type { RawJob } from "../../types/rawJob.types.js";
import type { ScraperProvider } from "../../interfaces/scraperProvider.interface.js";

import { browserService } from "../../browser/browser.service.js";

import { googleSearch } from "./google.search.js";
import { googleList } from "./google.list.js";
import { googleDetails } from "./google.details.js";
import { googleMapper } from "./google.mapper.js";
import { googlePagination } from "./google.pagination.js";

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

      const allListings = [];

      let currentPage = 1;

      while (true) {
        console.log(`📄 Discovering Google page ${currentPage}...`);

        const listings = await googleList.discover(page);

        console.log(`Found ${listings.length} listing(s).`);

        allListings.push(...listings);

        const hasNext = await googlePagination.nextPage(page);

        if (!hasNext) {
          console.log("✅ Last Google page reached.");

          break;
        }

        currentPage++;
      }

      console.log("");

      console.log(`📦 Total Listings Discovered: ${allListings.length}`);

      console.log("");

      const jobs: RawJob[] = [];

      let currentJob = 1;

      for (const listing of allListings) {
        try {
          console.log(
            `(${currentJob}/${allListings.length}) Scraping ${listing.platformJobId}`,
          );

          const detail = await googleDetails.extract(page, listing);

          const rawJob = googleMapper.toRawJob(listing, detail);

          jobs.push(rawJob);

          currentJob++;
        } catch (error) {
          console.error(`Failed to scrape Google job ${listing.platformJobId}`);

          console.error(error);
        }
      }

      console.log(`✅ Extracted ${jobs.length} job(s).`);

      return jobs;
    } finally {
      await browserService.close(session);
    }
  }
}

export const googleProvider = new GoogleProvider();
