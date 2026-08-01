import type { Prisma } from "@prisma/client";

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

  rawJson?: Prisma.InputJsonValue;

  location?: string;

  scrapedAt: Date;
}