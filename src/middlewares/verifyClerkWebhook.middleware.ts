import type { NextFunction, Request, Response } from "express";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/backend";

import { env } from "../config/index.js";
import { ApiError } from "../utils/index.js";

export const verifyClerkWebhook = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    const svixId = req.headers["svix-id"];
    const svixTimestamp = req.headers["svix-timestamp"];
    const svixSignature = req.headers["svix-signature"];

    if (!svixId || !svixTimestamp || !svixSignature) {
        return next(new ApiError(400, "Missing Svix headers"));
    }

    try {
        const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET);

        const event = webhook.verify(req.body, {
            "svix-id": String(svixId),
            "svix-timestamp": String(svixTimestamp),
            "svix-signature": String(svixSignature),
        }) as WebhookEvent;
        req.clerkWebhookEvent = event;

        next();

    } catch (error) {
    console.error("Svix verification failed:", error);

    next(new ApiError(401, "Invalid webhook signature"));
}

};