import type { Responsibilities } from "../schemas/canonicalJob.schema.js";

export function formatResponsibilities(
  responsibilities: Responsibilities,
): string {
  const lines: string[] = [];

  const sections: Array<[string, string[]]> = [
    ["Primary Responsibilities", responsibilities.primary],
    ["Secondary Responsibilities", responsibilities.secondary],
    ["Leadership Responsibilities", responsibilities.leadership],
    ["Communication Responsibilities", responsibilities.communication],
    ["Other Responsibilities", responsibilities.other],
  ];

  for (const [title, items] of sections) {
    if (items.length === 0) {
      continue;
    }

    if (lines.length > 0) {
      lines.push("");
    }

    lines.push(`${title}:`);

    for (const item of items) {
      lines.push(`- ${item}`);
    }
  }

  return lines.join("\n").trim();
}