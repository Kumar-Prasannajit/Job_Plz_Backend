import type { Request, Response } from "express";

import {
    ApiError,
    ApiResponse,
    asyncHandler,
} from "../../../utils/index.js";

import { userService } from "../services/user.service.js";
import { mapClerkUserToDTO } from "../mappers/clerk.mapper.js";
import { CLERK_EVENTS } from "../../../utils/constants.js";

export const clerkWebhook = asyncHandler(
    async (req: Request, res: Response) => {
        const event = req.clerkWebhookEvent!;

        switch (event.type) {
            case CLERK_EVENTS.USER_CREATED: {
                const user = mapClerkUserToDTO(event.data);

                await userService.syncCreatedUser(user);
                break;
            }

            case CLERK_EVENTS.USER_UPDATED: {
                const user = mapClerkUserToDTO(event.data);

                await userService.syncUpdatedUser(user);
                break;
            }

            case CLERK_EVENTS.USER_DELETED: {
                if (!event.data.id) {
                    throw new ApiError(
                        400,
                        "Missing Clerk user ID in webhook payload"
                    );
                }

                await userService.syncDeletedUser(event.data.id);
                break;
            }

            default:
                break;
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Webhook processed successfully"
            )
        );
    }
);