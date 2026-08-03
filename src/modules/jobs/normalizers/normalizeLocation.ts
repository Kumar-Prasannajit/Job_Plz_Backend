import type { Location } from "../schemas/canonicalJob.schema.js";

import {
  normalizeString,
} from "../normalizers/utils/index.js";

export function normalizeLocation(location: Location): Location {
  return {
    city: normalizeString(location.city),

    state: normalizeString(location.state),

    country: normalizeString(location.country),

    relocation: Boolean(location.relocation),

    visaSponsorship: Boolean(location.visaSponsorship),
  };
}