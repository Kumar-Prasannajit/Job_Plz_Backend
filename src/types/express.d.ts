import type { WebhookEvent } from "@clerk/backend";
import type { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      clerkWebhookEvent?: WebhookEvent;
    }
  }
}

export {};