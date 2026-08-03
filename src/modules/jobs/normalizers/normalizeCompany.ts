import type { Company } from "../schemas/canonicalJob.schema.js";

import {
  normalizeParagraph,
  normalizeString,
  normalizeUrl,
} from "../normalizers/utils/index.js";

export function normalizeCompany(company: Company): Company {
  return {
    name: normalizeString(company.name),
    
    website: normalizeUrl(company.website),

    industry: normalizeString(company.industry),

    size: normalizeString(company.size),

    description: normalizeParagraph(company.description),
  };
}