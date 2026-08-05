import type { Page } from "playwright";

import { googleSelectors } from "./google.selectors.js";

class GooglePagination {
  async hasNextPage(
    page: Page,
  ): Promise<boolean> {
    return (
      (await page
        .locator(googleSelectors.nextPage)
        .count()) > 0
    );
  }

  async nextPage(
    page: Page,
  ): Promise<boolean> {
    const next = page.locator(
      googleSelectors.nextPage,
    );

    if ((await next.count()) === 0) {
      return false;
    }

    const href = await next.getAttribute("href");

    if (!href) {
      return false;
    }

    const nextUrl = new URL(
      href,
      "https://www.google.com",
    ).toString();

    console.log(
      `➡️ Moving to: ${nextUrl}`,
    );

    await page.goto(nextUrl, {
      waitUntil: "networkidle",
    });

    return true;
  }
}

export const googlePagination =
  new GooglePagination();