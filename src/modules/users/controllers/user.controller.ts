import type { Request, Response } from "express";

import { ApiError, ApiResponse, asyncHandler } from "../../../utils/index.js";

import { userService } from "../services/user.service.js";
import { mapClerkUserToDTO } from "../mappers/clerk.mapper.js";
import { CLERK_EVENTS } from "../../../utils/constants.js";

export const clerkWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("===== CLERK WEBHOOK HIT =====");

    const event = req.clerkWebhookEvent!;

    console.log("Event Type:", event.type);
    console.log("Clerk User ID:", event.data.id);

    switch (event.type) {
      case CLERK_EVENTS.USER_CREATED: {
        console.log("USER_CREATED event received");

        const user = mapClerkUserToDTO(event.data);

        console.log("Mapped User:", user);

        await userService.syncCreatedUser(user);

        console.log("User synced successfully");

        break;
      }

      case CLERK_EVENTS.USER_UPDATED: {
        console.log("USER_UPDATED event received");

        const user = mapClerkUserToDTO(event.data);

        await userService.syncUpdatedUser(user);

        break;
      }

      case CLERK_EVENTS.USER_DELETED: {
        console.log("USER_DELETED event received");

        if (!event.data.id) {
          throw new ApiError(400, "Missing Clerk user ID in webhook payload");
        }

        await userService.syncDeletedUser(event.data.id);

        break;
      }

      default:
        console.log("Unhandled event:", event.type);
        break;
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Webhook processed successfully"));
  },
);
