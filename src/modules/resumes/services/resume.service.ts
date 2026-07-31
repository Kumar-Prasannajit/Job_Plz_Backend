import { CANONICAL_RESUME_SCHEMA_VERSION } from "../schemas/canonicalResume.schema.js";
import type { CanonicalResume } from "../schemas/canonicalResume.schema.js";

import { ApiError } from "../../../utils/ApiError.js";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary.js";

import { normalizeResume } from "../normalizers/normalizeResume.js";

import { resumeRepository } from "../repositories/resume.repository.js";

import { resumeExtractorService } from "./resumeExtractor.service.js";
import { resumeParserService } from "./resumeParser.service.js";
import { resumeValidatorService } from "./resumeValidator.service.js";
import type {
  UploadResumeResponse,
  UpdateResumeRequest,
  UpdateResumeResponse,
  FinalizeResumeRequest,
  FinalizeResumeResponse,
} from "../types/resume.types.js";
import { EmbeddingService } from "../../embeddings/embedding.service.js";
class ResumeService {
  async uploadResume(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UploadResumeResponse> {
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

    // Save to database
    const savedResume = await resumeRepository.create({
      userId,
      originalFileName: file.originalname,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      parsedData: validationResult.data,
      parserVersion: validationResult.data.metadata.parserVersion,
    });

    const response = {
      resumeId: savedResume.id,
      data: validationResult.data,
    };

    console.log(JSON.stringify(response, null, 2));

    return response;
  }

  async updateResume(
    input: UpdateResumeRequest,
  ): Promise<UpdateResumeResponse> {
    const validationResult = resumeValidatorService.safeValidate(input.data);

    if (!validationResult.success) {
      throw new ApiError(
        422,
        "Resume validation failed.",
        resumeValidatorService.formatErrors(validationResult.error),
      );
    }

    const updatedResume = await resumeRepository.updateParsedData(
      input.resumeId,
      validationResult.data,
    );

    return {
      resumeId: updatedResume.id,
      data: validationResult.data,
    };
  }

  async getResumeById(resumeId: string): Promise<UploadResumeResponse> {
    const resume = await resumeRepository.findById(resumeId);

    if (!resume) {
      throw new ApiError(404, "Resume not found.");
    }

    return {
      resumeId: resume.id,
      data: resume.parsedData as CanonicalResume,
    };
  }

  async finalizeResume(
    input: FinalizeResumeRequest,
  ): Promise<FinalizeResumeResponse> {
    const resume = await resumeRepository.findByIdAndUserId(
      input.resumeId,
      input.userId,
    );

    if (!resume) {
      throw new ApiError(404, "Resume not found.");
    }

    const validationResult = resumeValidatorService.safeValidate(
      resume.parsedData as CanonicalResume,
    );

    if (!validationResult.success) {
      throw new ApiError(
        422,
        "Resume validation failed.",
        resumeValidatorService.formatErrors(validationResult.error),
      );
    }

    const embeddingService = new EmbeddingService();

    const chunks = embeddingService.format(validationResult.data);

    const embeddings = await embeddingService.generateEmbeddings(chunks);

    console.log("Generated embeddings:", embeddings.length);

    console.log("Embedding dimension:", embeddings[0]?.length);

    console.log("First 5 values:", embeddings[0]?.slice(0, 5));

    return {
      resumeId: resume.id,
      chunks: chunks.length,
      embeddingDimension: embeddings[0]?.length ?? 0,
      embeddingsGenerated: true,
    };
  }
}

export const resumeService = new ResumeService();
