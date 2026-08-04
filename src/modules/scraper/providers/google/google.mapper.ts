import type { RawJob } from "../../types/rawJob.types.js";

import type { GoogleDetail, GoogleListing } from "./google.types.js";

class GoogleMapper {
  toRawJob(listing: GoogleListing, detail: GoogleDetail): RawJob {
    const rawJob: RawJob = {
      jobUrl: detail.jobUrl,

      platform: "Google Careers",

      platformJobId: listing.platformJobId,

      companyName: detail.companyName,

      jobTitle: detail.title,

      rawText: detail.rawText,

      scrapedAt: new Date(),
    };

    if (detail.companyWebsite) {
      rawJob.companyWebsite = detail.companyWebsite;
    }

    if (detail.companyLogoUrl) {
      rawJob.companyLogoUrl = detail.companyLogoUrl;
    }

    if (detail.location) {
      rawJob.location = detail.location;
    }

    return rawJob;
  }
}

export const googleMapper = new GoogleMapper();
