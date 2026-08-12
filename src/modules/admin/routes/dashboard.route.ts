import { Router } from "express";

import { getAuth } from "@clerk/express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../../middlewares/admin.middleware.js";

import { dashboardController } from "../controllers/dashboard.controller.js";

const router = Router();

// Apply authentication and admin authorization to all routes in this router
router.use(authenticate);
router.use(requireAdmin);


router.get("/overview", dashboardController.overview);

router.get("/sources", dashboardController.sources);

router.get("/recent-jobs", dashboardController.recentJobs);

export default router;
