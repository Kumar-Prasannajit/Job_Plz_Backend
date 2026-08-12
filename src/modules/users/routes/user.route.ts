import { Router } from "express";
import express from "express";

import { clerkWebhook } from "../controllers/user.controller.js";
import { verifyClerkWebhook } from "../../../middlewares/verifyClerkWebhook.middleware.js";

const router = Router();

router.post("/clerk", verifyClerkWebhook, clerkWebhook);

// Debug endpoint - remove in production
router.get("/test-webhook", (_req, _res) => {
  _res.json({
    message: "Webhook endpoint is reachable",
    endpoint: "/api/v1/webhooks/clerk",
    instructions: "Configure this endpoint in Clerk Dashboard → Settings → Webhooks",
  });
});

export default router;
