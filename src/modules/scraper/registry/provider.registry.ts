import type { ScraperProvider } from "../interfaces/scraperProvider.interface.js";

import { scraperProviders } from "../providers/index.js";

class ProviderRegistry {
  private readonly providers = new Map<
    string,
    ScraperProvider
  >();

  constructor() {
    for (const provider of scraperProviders) {
      this.register(provider);
    }
  }

  register(
    provider: ScraperProvider,
  ): void {
    this.providers.set(provider.id, provider);
  }

  tryGet(
    id: string,
  ): ScraperProvider | undefined {
    return this.providers.get(id);
  }

  getOrThrow(
    id: string,
  ): ScraperProvider {
    const provider = this.tryGet(id);

    if (!provider) {
      throw new Error(
        `Scraper provider "${id}" is not registered.`,
      );
    }

    return provider;
  }

  has(
    id: string,
  ): boolean {
    return this.providers.has(id);
  }

  getAll(): readonly ScraperProvider[] {
    return [...this.providers.values()];
  }

  getIds(): readonly string[] {
    return [...this.providers.keys()];
  }

  count(): number {
    return this.providers.size;
  }
}

export const providerRegistry =
  new ProviderRegistry();