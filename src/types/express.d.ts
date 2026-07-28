import type { WebhookEvent } from "@clerk/backend";
import "express";

declare module "express-serve-static-core" {
    interface Request {
        clerkWebhookEvent?: WebhookEvent;
    }
}