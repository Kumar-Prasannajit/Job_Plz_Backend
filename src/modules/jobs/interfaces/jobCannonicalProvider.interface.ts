import type { RawJob } from "@prisma/client";
import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

export interface JobCanonicalProvider {
  readonly providerId: string;

  map(rawJob: RawJob): Promise<CanonicalJob>;
}