import type { JobEmbeddingChunk } from "./jobEmbedding.types.js";

import { formatJobSummary } from "../formatters/formatJobSummary.js";
import { formatSkills } from "../formatters/formatSkills.js";
import { formatRequirements } from "../formatters/formatRequirements.js";
import { formatResponsibilities } from "../formatters/formatResponsibilities.js";

import type { CanonicalJob } from "../schemas/canonicalJob.schema.js";

export function buildJobChunks(
  job: CanonicalJob,
): JobEmbeddingChunk[] {
  const chunks: JobEmbeddingChunk[] = [];

  const summary = formatJobSummary(
    job.job,
  );

  if (summary) {
    chunks.push({
      chunkIndex: chunks.length,
      chunkType: "JOB_SUMMARY",
      content: summary,
    });
  }

  const skills = formatSkills(
    job.skills,
  );

  if (skills) {
    chunks.push({
      chunkIndex: chunks.length,
      chunkType: "SKILLS",
      content: skills,
    });
  }

  const requirements = formatRequirements(
    job.requirements,
  );

  if (requirements) {
    chunks.push({
      chunkIndex: chunks.length,
      chunkType: "REQUIREMENTS",
      content: requirements,
    });
  }

  const responsibilities =
    formatResponsibilities(
      job.responsibilities,
    );

  if (responsibilities) {
    chunks.push({
      chunkIndex: chunks.length,
      chunkType: "RESPONSIBILITIES",
      content: responsibilities,
    });
  }

  return chunks;
}