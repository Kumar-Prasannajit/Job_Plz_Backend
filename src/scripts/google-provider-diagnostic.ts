import { browserService } from "../modules/scraper/browser/browser.service.js";

async function runPhase(title: string, phase: () => Promise<void>) {
  console.log("\n====================================================");
  console.log(title);
  console.log("====================================================");

  const started = Date.now();

  try {
    await phase();

    console.log(`\n✅ ${title} completed in ${Date.now() - started} ms`);
  } catch (error) {
    console.error(`\n❌ ${title} failed after ${Date.now() - started} ms`);

    console.error(error);

    throw error;
  }
}

async function main() {
  const session = await browserService.launch({
    headless: false,
    timeout: 60_000,
  });

  const { page } = session;

  try {
    let firstJobTitle = "";
    let learnMoreHref = "";

    // ====================================================
    // PHASE 1
    // ====================================================

    await runPhase("PHASE 1 - Open Google Careers", async () => {
      console.log("🚀 Opening Google Careers...");

      await page.goto(
        "https://www.google.com/about/careers/applications/jobs/results/",
        {
          waitUntil: "networkidle",
        },
      );

      console.log("✅ Page Loaded");
      console.log("URL:", page.url());
      console.log("Title:", await page.title());
    });

    // ====================================================
    // PHASE 2
    // ====================================================

    await runPhase("PHASE 2 - Wait for Hydration", async () => {
      console.log("Waiting for Google Careers SPA to hydrate...");

      await page.waitForTimeout(5000);

      console.log("✅ Hydration Complete");
    });

    // ====================================================
    // PHASE 3
    // ====================================================

    await runPhase("PHASE 3 - Discover Job Listings", async () => {
      const titles = page.locator("h3");

      const totalTitles = await titles.count();

      console.log("Total H3 Elements:", totalTitles);

      // First 7 are sidebar filters
      const filterCount = 7;

      const jobCount = totalTitles - filterCount;

      console.log("Sidebar Filters:", filterCount);
      console.log("Detected Jobs:", jobCount);

      firstJobTitle = await titles.nth(filterCount).innerText();

      console.log("First Job:");
      console.log(firstJobTitle);
    });
    // ====================================================
    // PHASE 4
    // ====================================================

    await runPhase("PHASE 4 - Locate First Job Card", async () => {
      const titles = page.locator("h3");

      // Skip sidebar headings
      const firstJob = titles.nth(7);

      console.log("Selected Job:");
      console.log(await firstJob.innerText());

      const card = firstJob.locator(
        "xpath=ancestor::div[contains(@class,'sMn82b')]",
      );

      console.log("Job Card Located ✅");

      const learnMore = card.locator('a[aria-label^="Learn more about"]');

      const learnMoreCount = await learnMore.count();

      console.log("Learn More Links:", learnMoreCount);

      if (learnMoreCount !== 1) {
        throw new Error(
          `Expected exactly one Learn More link, found ${learnMoreCount}`,
        );
      }

      learnMoreHref = (await learnMore.getAttribute("href")) ?? "";

      console.log("Learn More Href:");
      console.log(learnMoreHref);
    });

    // ====================================================
    // PHASE 5
    // ====================================================

    await runPhase("PHASE 5 - Open Job Detail Page", async () => {
      const titles = page.locator("h3");

      const firstJob = titles.nth(7);

      const card = firstJob.locator(
        "xpath=ancestor::div[contains(@class,'sMn82b')]",
      );

      const learnMore = card.locator('a[aria-label^="Learn more about"]');

      console.log("Opening Job Detail Page...");

      await learnMore.click();

      await page.waitForURL(/\/jobs\/results\/\d+/);

      console.log("Navigation Successful ✅");

      console.log("Current URL:");
      console.log(page.url());

      console.log("Current Title:");
      console.log(await page.title());
    });

    // ====================================================
    // PHASE 6
    // ====================================================

    let rawText = "";

    await runPhase("PHASE 6 - Discover Detail Container", async () => {
      const mains = page.locator("main");

      const mainCount = await mains.count();

      console.log(`Found ${mainCount} <main> element(s).\n`);

      let selectedMain = -1;

      for (let i = 0; i < mainCount; i++) {
        const text = await mains.nth(i).innerText();

        console.log(`MAIN ${i} -> ${text.length.toLocaleString()} characters`);

        if (
          text.includes("Minimum qualifications") &&
          text.includes("About the job")
        ) {
          selectedMain = i;
          rawText = text;
        }
      }

      if (selectedMain === -1) {
        throw new Error("Unable to locate the Job Detail container.");
      }

      console.log("\n✅ Selected MAIN:", selectedMain);
      console.log(`Characters Extracted: ${rawText.length.toLocaleString()}`);
    });

    // ====================================================
    // PHASE 7
    // ====================================================

    await runPhase("PHASE 7 - Raw Text Preview", async () => {
      console.log("First 1200 Characters\n");

      console.log("----------------------------------------\n");

      console.log(rawText.substring(0, 1200));

      console.log("\n----------------------------------------");

      console.log(`\nTotal Characters: ${rawText.length.toLocaleString()}`);
    });

    // ====================================================
    // PHASE 8
    // ====================================================

    const companyLocator = page
      .locator("main")
      .filter({
        hasText: "About the job",
      })
      .locator("text=Google")
      .first();

    let companyName = "Google";
    let location = "";

    await runPhase("PHASE 8 - Extract Lightweight Metadata", async () => {
      try {
        if (await companyLocator.isVisible()) {
          companyName = (await companyLocator.innerText()).trim();
        }
      } catch {
        companyName = "Google";
      }

      const detailText = rawText.split("\n");

      for (const line of detailText) {
        if (
          line.includes(",") &&
          !line.includes("Minimum qualifications") &&
          !line.includes("Preferred qualifications")
        ) {
          location = line.trim();
          break;
        }
      }

      console.log("Company :", companyName);
      console.log("Location:", location || "Not Detected");
    });

    // ====================================================
    // PHASE 9
    // ====================================================

    await runPhase("PHASE 9 - RawJob Preview", async () => {
      const rawJob = {
        jobUrl: page.url(),

        platform: "Google Careers",

        platformJobId: page.url().split("/results/")[1]?.split("-")[0] ?? "",

        companyName,

        companyWebsite: "https://about.google",

        companyLogoUrl:
          "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",

        jobTitle: firstJobTitle,

        rawHtml: null,

        rawText,

        rawJson: null,

        location,

        scrapedAt: new Date(),
      };

      console.log("\n================ RAW JOB ================\n");

      console.dir(rawJob, {
        depth: null,
      });

      console.log("\n=========================================\n");

      console.log(
        `Raw Text Size : ${rawJob.rawText.length.toLocaleString()} chars`,
      );
    });

    console.log("\n====================================================");
    console.log("GOOGLE PROVIDER DIAGNOSTIC COMPLETED");
    console.log("====================================================");

    console.log("Summary");

    console.table({
      Browser: "✅",
      CareersPage: "✅",
      Hydration: "✅",
      JobDiscovery: "✅",
      JobCard: "✅",
      Navigation: "✅",
      DetailContainer: "✅",
      RawText: "✅",
      RawJob: "✅",
    });

    console.log("\nThe browser will remain open.");
    console.log("Press Ctrl+C to exit.");
    console.log("====================================================\n");

    await new Promise(() => {});
  } finally {
    await browserService.close(session);
  }
}

main().catch((error) => {
  console.error("\n====================================================");
  console.error("GOOGLE PROVIDER DIAGNOSTIC FAILED");
  console.error("====================================================");

  console.error(error);

  process.exit(1);
});
