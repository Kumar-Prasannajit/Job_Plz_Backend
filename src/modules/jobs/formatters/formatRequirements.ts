import type { Requirements } from "../schemas/canonicalJob.schema.js";

export function formatRequirements(
  requirements: Requirements,
): string {
  const lines: string[] = [];

  if (requirements.minimumEducation) {
    lines.push(`Minimum Education: ${requirements.minimumEducation}`);
  }

  if (requirements.preferredEducation) {
    lines.push(`Preferred Education: ${requirements.preferredEducation}`);
  }

  if (
    requirements.minimumExperienceYears !== undefined &&
    requirements.minimumExperienceYears > 0
  ) {
    lines.push(
      `Minimum Experience: ${requirements.minimumExperienceYears} years`,
    );
  }

  if (
    requirements.preferredExperienceYears !== undefined &&
    requirements.preferredExperienceYears > 0
  ) {
    lines.push(
      `Preferred Experience: ${requirements.preferredExperienceYears} years`,
    );
  }

  if (requirements.requiredExperience.length > 0) {
    lines.push("");
    lines.push("Required Experience:");

    for (const item of requirements.requiredExperience) {
      lines.push(`- ${item}`);
    }
  }

  if (requirements.preferredExperience.length > 0) {
    lines.push("");
    lines.push("Preferred Experience:");

    for (const item of requirements.preferredExperience) {
      lines.push(`- ${item}`);
    }
  }

  if (requirements.certifications.length > 0) {
    lines.push("");
    lines.push("Certifications:");

    for (const certification of requirements.certifications) {
      lines.push(`- ${certification}`);
    }
  }

  if (requirements.languages.length > 0) {
    lines.push("");
    lines.push("Languages:");

    for (const language of requirements.languages) {
      lines.push(`- ${language}`);
    }
  }

  if (requirements.domainKnowledge.length > 0) {
    lines.push("");
    lines.push("Domain Knowledge:");

    for (const domain of requirements.domainKnowledge) {
      lines.push(`- ${domain}`);
    }
  }

  return lines.join("\n").trim();
}