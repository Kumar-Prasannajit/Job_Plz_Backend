import { connectDB } from "../config/database.js";

import { scraperService } from "../modules/scraper/services/scraper.service.js";
import { googleProvider } from "../modules/scraper/providers/google.provider.js";

async function main() {
  await connectDB();

  const jobs = await scraperService.scrape(googleProvider);

  console.log(`Successfully stored ${jobs} jobs.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));