import { ChunkType, type ResumeChunk } from "../../types.js";
import type { Formatter } from "../types.js";

export const formatCertifications: Formatter = (resume): ResumeChunk[] => {
  return resume.certifications.map((certification, index): ResumeChunk => {
    const lines: string[] = [];

    lines.push(`Name: ${certification.name}`);
    lines.push(
      `Issuing Organization: ${certification.issuingOrganization}`
    );

    if (certification.issueDate) {
      lines.push(`Issue Date: ${certification.issueDate}`);
    }

    if (certification.expiryDate) {
      lines.push(`Expiry Date: ${certification.expiryDate}`);
    }

    if (certification.credentialId) {
      lines.push(`Credential ID: ${certification.credentialId}`);
    }

    if (certification.credentialUrl) {
      lines.push(`Credential URL: ${certification.credentialUrl}`);
    }

    if (certification.skills.length > 0) {
      lines.push(`Skills: ${certification.skills.join(", ")}`);
    }

    return {
      chunkType: ChunkType.CERTIFICATION,
      chunkIndex: index,
      chunkContent: `CERTIFICATION

${lines.join("\n")}`,
    };
  });
};