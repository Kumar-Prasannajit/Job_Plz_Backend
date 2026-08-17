import { Router } from "express";

import { authenticate } from "../../../middlewares/auth.middleware.js";
import { recommendationController } from "../controllers/recommendation.controller.js";

const router = Router();

router.get(
  "/:resumeId",
  authenticate,
  recommendationController.getRecommendations,
);

export default router;