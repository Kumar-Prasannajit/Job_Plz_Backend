import type { WebhookEvent } from "@clerk/backend";
import type { User } from "@prisma/client";

declare module "express-serve-static-core" {
    interface Request {
        clerkWebhookEvent?: WebhookEvent;
        user?: User;
    }
}

export {};