import { Router } from "express";

import { authenticate } from "../../../middlewares/auth.middleware.js";
import { authorize } from "../../../middlewares/role.middleware.js";

import { userDashboardController } from "../controllers/userDashboard.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("USER"),
  userDashboardController.getDashboard,
);

export default router;