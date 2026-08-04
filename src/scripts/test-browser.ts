import { browserService } from "../modules/scraper/browser/browser.service.js";

async function main() {
  const session = await browserService.launch({
    headless: false,
  });

  try {
    console.log("Launching browser...");

    await session.page.goto("https://careers.google.com/", {
      waitUntil: "networkidle",
    });

    console.log(await session.page.title());

    console.log("Browser is open.");
    console.log("Inspect the page manually.");
    console.log("Press Ctrl+C when finished.");

    await new Promise(() => {});
  } finally {
    await browserService.close(session);
  }
}

main().catch(console.error);
