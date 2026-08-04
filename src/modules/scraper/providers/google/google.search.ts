import type { Page } from "playwright";

export class GoogleSearch {
  private static readonly SEARCH_URL =
    "https://www.google.com/about/careers/applications/jobs/results/";

  private static readonly HYDRATION_DELAY = 5_000;

  async open(page: Page): Promise<void> {
    await page.goto(GoogleSearch.SEARCH_URL, {
      waitUntil: "networkidle",
    });
  }

  async waitForHydration(page: Page): Promise<void> {
    await page.waitForTimeout(GoogleSearch.HYDRATION_DELAY);
  }

  async prepare(page: Page): Promise<void> {
    await this.open(page);

    await this.waitForHydration(page);
  }
}

export const googleSearch = new GoogleSearch();