export interface RawJob {
  jobUrl: string;

  platform?: string;
  platformJobId?: string;

  companyName: string;
  companyWebsite?: string;
  companyLogoUrl?: string;

  jobTitle: string;

  rawHtml?: string;
  rawText: string;

  rawJson?: unknown;

  location?: string;

  scrapedAt: Date;
}