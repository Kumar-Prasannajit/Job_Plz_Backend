// src/modules/admin/controllers/dashboard.controller.ts

import type {
  Request,
  Response,
} from "express";

import { dashboardService } from "../services/dashboard.service.js";

class DashboardController {
  async overview(
    req: Request,
    res: Response,
  ) {
    const data =
      await dashboardService.getOverview();

    res.status(200).json(data);
  }

  async sources(
    req: Request,
    res: Response,
  ) {
    const data =
      await dashboardService.getSources();

    res.status(200).json(data);
  }

  async recentJobs(
    req: Request,
    res: Response,
  ) {
    const limit = Number(req.query.limit ?? 20);

    const data =
      await dashboardService.getRecentJobs(
        limit,
      );

    res.status(200).json(data);
  }
}

export const dashboardController =
  new DashboardController();