import type {
  Request,
  Response,
} from "express";

import {
  asyncHandler,
  ApiResponse,
} from "../../../utils/index.js";

import { userDashboardService }
from "../services/userDashboard.service.js";

class UserDashboardController {
  getDashboard = asyncHandler(
    async (
      req: Request,
      res: Response,
    ) => {
      const dashboard =
        await userDashboardService.getDashboard(
          req.user!.id,
        );

      return res.status(200).json(
        new ApiResponse(
          200,
          dashboard,
          "Dashboard fetched successfully",
        ),
      );
    },
  );
}

export const userDashboardController =
  new UserDashboardController();