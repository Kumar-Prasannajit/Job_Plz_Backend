import type { Page } from "playwright";

import type {
  GoogleDetail,
  GoogleListing,
} from "./google.types.js";

import { googleSelectors } from "./google.selectors.js";

class GoogleDetails {
  async extract(
    page: Page,
    listing: GoogleListing,
  ): Promise<GoogleDetail> {
    await page.goto(listing.detailUrl, {
      waitUntil: "networkidle",
    });

    const rawText = await this.extractRawText(page);

    return {
      jobUrl: page.url(),

      title: this.extractTitle(rawText),

      companyName: "Google",

      companyWebsite: "https://about.google",

      companyLogoUrl:
        "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",

      location: this.extractLocation(rawText),

      rawText,
    };
  }

  private async extractRawText(
    page: Page,
  ): Promise<string> {
    const mains = page.locator(
      googleSelectors.detailContainer,
    );

    const count = await mains.count();

    for (let i = 0; i < count; i++) {
      const text = await mains.nth(i).innerText();

      const isDetailContainer =
        googleSelectors.detailMarkers.every((marker) =>
          text.includes(marker),
        );

      if (isDetailContainer) {
        return text;
      }
    }

    throw new Error(
      "Unable to locate Google job detail container.",
    );
  }

  private extractTitle(
    rawText: string,
  ): string {
    const lines = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return lines[0] ?? "";
  }

  private extractLocation(
    rawText: string,
  ): string {
    const lines = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      if (
        line.includes(",") &&
        !line.includes("Minimum qualifications") &&
        !line.includes("Preferred qualifications")
      ) {
        return line;
      }
    }

    return "";
  }
}

export const googleDetails = new GoogleDetails();