import type { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../../../utils/index.js";

import { providerRegistry } from "../registry/provider.registry.js";
import { scraperService } from "../services/scraper.service.js";

class ScraperController {
  async runProvider(
    req: Request<{ providerId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { providerId } = req.params;

      const provider = providerRegistry.getOrThrow(providerId);

      const result = await scraperService.scrape(provider);

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            result,
            `${provider.name} scraper completed successfully.`,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async listProviders(_req: Request, res: Response): Promise<void> {
    const providers = providerRegistry.getAll().map((provider) => ({
      id: provider.id,
      name: provider.name,
    }));

    res
      .status(200)
      .json(new ApiResponse(200, providers, "Available scraper providers."));
  }
}

export const scraperController = new ScraperController();
