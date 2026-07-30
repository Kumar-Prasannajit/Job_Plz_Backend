import { CANONICAL_RESUME_SCHEMA_VERSION } from "../schemas/canonicalResume.schema.js";
import type { CanonicalResume } from "../schemas/canonicalResume.schema.js";

import { ApiError } from "../../../utils/ApiError.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";

import { normalizeResume } from "../normalizers/normalizeResume.js";

import { resumeRepository } from "../repositories/resume.repository.js";

import { resumeExtractorService } from "./resumeExtractor.service.js";
import { resumeParserService } from "./resumeParser.service.js";
import { resumeValidatorService } from "./resumeValidator.service.js";
import { EmbeddingService } from "../../embeddings/embedding.service.js";
class ResumeService {
  async uploadResume(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{
    resumeId: string;
    data: CanonicalResume;
  }> {
    // Upload PDF & parse text in parallel
    const [uploadResult, rawText] = await Promise.all([
      uploadToCloudinary(file.buffer, "resumes"),
      resumeParserService.parse(file.buffer),
    ]);

    // AI extraction
    const extractedResume = await resumeExtractorService.extract(rawText);

    // Attach metadata
    const canonicalResume: CanonicalResume = {
      ...(extractedResume as Omit<CanonicalResume, "metadata">),
      metadata: {
        parserVersion: CANONICAL_RESUME_SCHEMA_VERSION,
        extractedAt: new Date().toISOString(),
        sourceFileName: file.originalname,
      },
    };

    // Normalize
    const normalizedResume = normalizeResume(canonicalResume);

    // Validate
    const validationResult =
      resumeValidatorService.safeValidate(normalizedResume);

    if (!validationResult.success) {
      throw new ApiError(
        422,
        "Resume validation failed.",
        resumeValidatorService.formatErrors(validationResult.error),
      );
    }

    // Text FORMATTER
    const embeddingService = new EmbeddingService();
    const chunks = embeddingService.format(validationResult.data);

    // Save to database
    const savedResume = await resumeRepository.create({
      userId,
      originalFileName: file.originalname,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      parsedData: validationResult.data,
      parserVersion: validationResult.data.metadata.parserVersion,
    });

    return {
      resumeId: savedResume.id,
      data: validationResult.data,
    };
  }
}

export const resumeService = new ResumeService();
