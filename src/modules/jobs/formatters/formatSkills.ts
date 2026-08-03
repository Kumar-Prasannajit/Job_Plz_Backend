import type { Skills } from "../../resumes/schemas/canonicalResume.schema.js";

export function formatSkills(skills: Skills): string {
  const lines: string[] = [];

  const sections: Array<[string, string[]]> = [
    ["Programming Languages", skills.languages],
    ["Frontend", skills.frontend],
    ["Backend", skills.backend],
    ["Database", skills.database],
    ["Cloud", skills.cloud],
    ["DevOps", skills.devops],
    ["Testing", skills.testing],
    ["Artificial Intelligence", skills.ai],
    ["Operating Systems", skills.operatingSystems],
    ["Mobile", skills.mobile],
    ["Tools", skills.tools],
    ["Soft Skills", skills.softSkills],
    ["Miscellaneous", skills.miscellaneous],
  ];

  for (const [title, values] of sections) {
    if (values.length === 0) {
      continue;
    }

    if (lines.length > 0) {
      lines.push("");
    }

    lines.push(`${title}:`);

    for (const value of values) {
      lines.push(`- ${value}`);
    }
  }

  return lines.join("\n").trim();
}