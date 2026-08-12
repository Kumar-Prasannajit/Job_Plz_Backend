import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { ApiError } from "../utils/index.js";

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    next(
      new ApiError(401, "Unauthorized"),
    );
    return;
  }

  if (req.user.role !== "ADMIN") {
    next(
      new ApiError(
        403,
        "Admin access required",
      ),
    );
    return;
  }

  next();
};