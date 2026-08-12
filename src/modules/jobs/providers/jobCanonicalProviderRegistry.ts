import type { JobCanonicalProvider } from "../interfaces/jobCannonicalProvider.interface.js";

import { googleCanonicalProvider } from "./google/googleCanonicalProvider.js";

class JobCanonicalProviderRegistry {
  private readonly providers =
    new Map<string, JobCanonicalProvider>();

  constructor() {
    this.providers.set(
      "Google Careers",
      googleCanonicalProvider,
    );
  }

  get(
    platform: string,
  ): JobCanonicalProvider {
    const provider =
      this.providers.get(platform);

    if (!provider) {
      throw new Error(
        `No canonical provider found for platform: ${platform}`,
      );
    }

    return provider;
  }
}

export const jobCanonicalProviderRegistry =
  new JobCanonicalProviderRegistry();