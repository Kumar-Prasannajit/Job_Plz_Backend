import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

import { ApiError } from "../utils/index.js";
import { userRepository } from "../modules/users/repositories/user.repository.js";

export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const auth = getAuth(req);

        if (!auth.isAuthenticated || !auth.userId) {
            return next(new ApiError(401, "Unauthorized"));
        }

        const user = await userRepository.findByClerkId(auth.userId);

        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};