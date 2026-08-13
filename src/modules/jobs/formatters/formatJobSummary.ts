import type { Job } from "../schemas/canonicalJob.schema.js";

export function formatJobSummary(job: Job): string {
  const lines: string[] = [];

  lines.push(`Job Title: ${job.title}`);

  if (job.summary) {
    lines.push("");
    lines.push(job.summary);
  }

  return lines.join("\n").trim();
}