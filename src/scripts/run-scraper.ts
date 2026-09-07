import { connectDB } from "../config/database.js";

import { scraperService } from "../modules/scraper/services/scraper.service.js";
import { googleProvider } from "../modules/scraper/providers/google/google.provider.js";

async function main() {
  await connectDB();

  const result = await scraperService.scrape(googleProvider);

  console.log("\n========================================");
  console.log("✅ Scraping Completed");
  console.log("========================================");

  console.log(`Provider      : ${result.provider}`);
  console.log(`Scraped       : ${result.scraped}`);
  console.log(`Inserted      : ${result.inserted}`);
  console.log(`Duplicates    : ${result.duplicates}`);
  console.log(`Processed     : ${result.processed}`);
  console.log(`Failed        : ${result.failed}`);
  console.log(`Duration      : ${result.durationMs} ms`);

  console.log("========================================\n");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
