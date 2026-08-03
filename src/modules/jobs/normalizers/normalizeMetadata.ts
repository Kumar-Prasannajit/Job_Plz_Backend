import type { Metadata } from "../schemas/canonicalJob.schema.js";

import { normalizeString } from "../normalizers/utils/index.js";

export function normalizeMetadata(
  metadata: Metadata,
): Metadata {
  return {
    parserVersion: normalizeString(
      metadata.parserVersion,
    ),

    processedAt: normalizeString(
      metadata.processedAt,
    ),

    confidence:
      metadata.confidence ?? undefined,
  };
}