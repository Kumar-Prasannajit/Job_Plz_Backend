import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/index.js";

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      data: null,
    });

    return;
  }

  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
    errors: [],
    data: null,
  });
};
