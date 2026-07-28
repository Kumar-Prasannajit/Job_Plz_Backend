import type { UserJSON } from "@clerk/backend";
import { ApiError } from "../../../utils/index.js";
import type { UserSyncDTO } from "../types/user.types.js";

export const mapClerkUserToDTO = (
    user: UserJSON
): UserSyncDTO => {
    const email = user.email_addresses[0]?.email_address;

    if (!email) {
        throw new ApiError(400, "Email not found in Clerk payload");
    }

    return {
        clerkUserId: user.id,
        email,
        firstName: user.first_name ?? null,
        lastName: user.last_name ?? null,
        imageUrl: user.image_url ?? null,
    };
};