import type { Page } from "playwright";

import type { GoogleListing } from "./google.types.js";

import { googleSelectors } from "./google.selectors.js";

class GoogleList {
  async discover(page: Page): Promise<GoogleListing[]> {
    const links = page.locator(
      googleSelectors.learnMore,
    );

    const count = await links.count();

    const listings: GoogleListing[] = [];

    for (let i = 0; i < count; i++) {
      const href = await links
        .nth(i)
        .getAttribute("href");

      if (!href) {
        continue;
      }

      const detailUrl = new URL(
        href,
        "https://www.google.com/about/careers/applications/",
      ).toString();

      const match = detailUrl.match(
        /results\/(\d+)/
      );

      const platformJobId = match?.[1];

      if (!platformJobId) {
        continue;
      }

      listings.push({
        platformJobId,
        detailUrl,
      });
    }

    return listings;
  }
}

export const googleList = new GoogleList();