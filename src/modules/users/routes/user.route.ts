import { Router } from "express";
import express from "express";

import { clerkWebhook } from "../controllers/user.controller.js";
import { verifyClerkWebhook } from "../../../middlewares/verifyClerkWebhook.middleware.js";

const router = Router();

router.post(
    "/clerk",
    verifyClerkWebhook,
    clerkWebhook
);

export default router;