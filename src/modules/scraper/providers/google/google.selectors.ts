//This file contains only selectors. If Google changes its DOM later, this is usually the only file you'll need to update.

export const googleSelectors = {
  jobHeadings: "h3",

  jobCard: "xpath=ancestor::div[contains(@class,'sMn82b')]",

  learnMore: 'a[aria-label^="Learn more about"]',

  detailContainer: "main",

  detailMarkers: ["Minimum qualifications", "About the job"],

  nextPage: 'a[aria-label="Go to next page"]',
} as const;
