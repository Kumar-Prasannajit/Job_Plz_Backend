import type { Request, Response } from "express";

import { asyncHandler, ApiError, ApiResponse } from "../../../utils/index.js";
import { resumeService } from "../services/resume.service.js";

export const uploadResume = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, "Resume file is required.");
    }

    if (!req.user) {
      throw new ApiError(401, "Unauthorized.");
    }

    const resume = await resumeService.uploadResume(req.user.id, req.file);

    return res
      .status(201)
      .json(new ApiResponse(201, resume, "Resume uploaded successfully."));
  },
);

export const updateResume = asyncHandler(
  async (req: Request, res: Response) => {
    const resumeId = req.params.resumeId;

    if (typeof resumeId !== "string") {
      throw new ApiError(400, "Invalid resume ID.");
    }

    if (!resumeId) {
      throw new ApiError(400, "Resume ID is required.");
    }

    const resume = await resumeService.updateResume({
      resumeId,
      data: req.body,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, resume, "Resume updated successfully."));
  },
);

export const getResumeById = asyncHandler(
  async (req: Request, res: Response) => {
    const resumeId = req.params.resumeId;

    if (typeof resumeId !== "string") {
      throw new ApiError(400, "Invalid resume ID.");
    }

    const resume = await resumeService.getResumeById(resumeId);

    return res
      .status(200)
      .json(new ApiResponse(200, resume, "Resume fetched successfully."));
  },
);

export const finalizeResume = asyncHandler(
  async (req: Request, res: Response) => {
    const resumeId = req.params.resumeId;

    if (typeof resumeId !== "string") {
      throw new ApiError(400, "Invalid resume ID.");
    }

    if (!resumeId) {
      throw new ApiError(400, "Resume ID is required.");
    }

    if (!req.user) {
      throw new ApiError(401, "Unauthorized.");
    }

    const result = await resumeService.finalizeResume({
      resumeId,
      userId: req.user.id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Resume finalized successfully.",
        ),
      );
  },
);
