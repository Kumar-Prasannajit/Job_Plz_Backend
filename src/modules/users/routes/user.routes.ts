import { Router } from "express";

import {
  clerkWebhook,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { verifyClerkWebhook } from "../../../middlewares/verifyClerkWebhook.middleware.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.post("/clerk", verifyClerkWebhook, clerkWebhook);

router.get("/me", authenticate, getCurrentUser);

export default router;
