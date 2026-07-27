import type { Request, Response } from "express";
import { ApiError } from "../utils/index.js";

export const notFoundHandler = (
    req: Request,
    _res: Response
): never => {
    throw new ApiError(
        404,
        `Route ${req.originalUrl} not found`
    );
};