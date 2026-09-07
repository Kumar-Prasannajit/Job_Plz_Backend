import { Router } from "express";

import { authenticate } from "../../../middlewares/auth.middleware.js";
import { authorize } from "../../../middlewares/role.middleware.js";

import { dashboardController } from "../controllers/dashboard.controller.js";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/overview", dashboardController.overview);

router.get("/sources", dashboardController.sources);

router.get("/recent-jobs", dashboardController.recentJobs);

export default router;
