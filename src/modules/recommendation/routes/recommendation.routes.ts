import { Router } from "express";

import { authenticate } from "../../../middlewares/auth.middleware.js";
import { authorize } from "../../../middlewares/role.middleware.js";
import { recommendationController } from "../controllers/recommendation.controller.js";

const router = Router();

router.get(
  "/:resumeId",
  authenticate,
  authorize("USER"),
  recommendationController.getRecommendations,
);

export default router;