import type {
  Request,
  Response,
} from "express";

import {
  ApiError,
  ApiResponse,
  asyncHandler,
} from "../../../utils/index.js";

import { jobQueryService }
from "../services/jobQuery.service.js";

class JobController {
  getById =
    asyncHandler(
      async (
        req: Request,
        res: Response,
      ) => {
        const { jobId } =
          req.params;

        if (
          !jobId ||
          Array.isArray(jobId)
        ) {
          throw new ApiError(
            400,
            "Invalid job id",
          );
        }

        const job =
          await jobQueryService.getById(
            jobId,
          );

        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              job,
              "Job fetched successfully",
            ),
          );
      },
    );
}

export const jobController =
  new JobController();