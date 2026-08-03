import type { Job } from "../schemas/canonicalJob.schema.js";

export function formatJobSummary(job: Job): string {
  const lines: string[] = [];

  lines.push(`Job Title: ${job.title}`);

  if (job.department) {
    lines.push(`Department: ${job.department}`);
  }

  lines.push(`Employment Type: ${job.employmentType}`);

  lines.push(`Work Mode: ${job.workMode}`);

  lines.push(`Job Level: ${job.jobLevel}`);

  if (job.jobFunction) {
    lines.push(`Job Function: ${job.jobFunction}`);
  }

  if (job.summary) {
    lines.push("");
    lines.push("Summary:");
    lines.push(job.summary);
  }

  return lines.join("\n").trim();
}