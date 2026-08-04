import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";

import type {
  BrowserOptions,
  BrowserSession,
} from "./browser.types.js";

class BrowserService {
  async launch(
    options: BrowserOptions = {},
  ): Promise<BrowserSession> {
    const browser: Browser =
      await chromium.launch({
        headless: options.headless ?? true,
      });

    const context: BrowserContext =
      await browser.newContext();

    const page: Page =
      await context.newPage();

    page.setDefaultTimeout(
      options.timeout ?? 30_000,
    );

    return {
      browser,
      context,
      page,
    };
  }

  async close(
    session: BrowserSession,
  ): Promise<void> {
    await session.browser.close();
  }
}

export const browserService =
  new BrowserService();