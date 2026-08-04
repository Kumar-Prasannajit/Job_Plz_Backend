export interface GoogleListing {
  platformJobId: string;

  detailUrl: string;
}

export interface GoogleDetail {
  jobUrl: string;

  title: string;

  companyName: string;

  companyWebsite?: string;

  companyLogoUrl?: string;

  location?: string;

  rawText: string;
}