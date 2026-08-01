import type { ScraperProvider } from "../interfaces/scraperProvider.interface.js";
import type { RawJob } from "../types/rawJob.types.js";

class GoogleProvider implements ScraperProvider {
  readonly name = "Google Careers";

  async scrape(): Promise<RawJob[]> {
    return [
      {
        jobUrl:
          "https://careers.google.com/jobs/results/example-strategy-associate",

        platform: "Google Careers",

        platformJobId: "google-demo-001",

        companyName: "Google",

        companyWebsite: "https://about.google",

        companyLogoUrl:
          "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",

        jobTitle: "Strategy Associate, YouTube",

        rawText: `
Strategy Associate, YouTube

Minimum Qualifications

Bachelor's degree in Business, Statistics, Economics,
Mathematics, Physics or equivalent practical experience.

3 years of management consulting experience.

Experience with analytics.

Preferred Qualifications

SQL
Financial Modeling
Data Visualization

Responsibilities

Perform quantitative analysis.
Communicate findings to executives.
Build business strategies.
        `.trim(),

        location: "San Bruno, CA, USA",

        scrapedAt: new Date(),
      },
    ];
  }
}

export const googleProvider = new GoogleProvider();