import type { Request, Response } from "express";

import { ApiError, ApiResponse, asyncHandler } from "../../../utils/index.js";

import { resumeRepository } from "../../resumes/repositories/resume.repository.js";

import { recommendationService } from "../services/recommendation.service.js";

class RecommendationController {
  getRecommendations = asyncHandler(async (req: Request, res: Response) => {
    const { resumeId } = req.params;

    if (!resumeId || Array.isArray(resumeId)) {
      throw new ApiError(400, "Invalid resume id");
    }

    const resume = await resumeRepository.findByIdAndUserId(
      resumeId,
      req.user!.id,
    );

    if (!resume) {
      throw new ApiError(404, "Resume not found");
    }

    const recommendations = await recommendationService.recommend(resumeId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          recommendations,
          "Recommendations fetched successfully",
        ),
      );
  });
}

export const recommendationController = new RecommendationController();
