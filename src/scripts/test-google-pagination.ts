import { browserService } from "../modules/scraper/browser/browser.service.js";
import { googlePagination } from "../modules/scraper/providers/google/google.pagination.js";
import { googleList } from "../modules/scraper/providers/google/google.list.js";

async function main() {
  const session = await browserService.launch({
    headless: false,
    timeout: 60_000,
  });

  const { page } = session;

  try {
    console.log("🚀 Opening Google Careers...");

    await page.goto(
      "https://www.google.com/about/careers/applications/jobs/results/",
      {
        waitUntil: "networkidle",
      },
    );

    let pageNumber = 1;

    while (pageNumber <= 5) {
      console.log("");
      console.log("========================================");
      console.log(`📄 PAGE ${pageNumber}`);
      console.log("========================================");

      console.log("URL:");
      console.log(page.url());

      const listings = await googleList.discover(page);

      console.log(
        `Found ${listings.length} listings`,
      );

      console.table(
        listings.map((job) => ({
          id: job.platformJobId,
          url: job.detailUrl,
        })),
      );

      const moved =
        await googlePagination.nextPage(page);

      if (!moved) {
        console.log("");
        console.log("✅ Reached last page.");
        break;
      }

      pageNumber++;
    }

    console.log("");
    console.log("Browser will remain open.");
    console.log("Press Ctrl+C to exit.");

    await new Promise(() => {});
  } finally {
    await browserService.close(session);
  }
}

main().catch(console.error);