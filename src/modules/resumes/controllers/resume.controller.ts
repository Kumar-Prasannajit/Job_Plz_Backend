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

        const resume = await resumeService.uploadResume(
            req.user.id,
            req.file
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                resume,
                "Resume uploaded successfully."
            )
        );

    }
);