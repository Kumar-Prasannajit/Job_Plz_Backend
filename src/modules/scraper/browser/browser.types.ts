import type { Browser, BrowserContext, Page } from "playwright";

export interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}

export interface BrowserOptions {
  headless?: boolean;
  timeout?: number;
}