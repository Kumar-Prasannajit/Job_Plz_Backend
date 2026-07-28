import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./config/env.js";

import healthRouter from "./routes/health.route.js";
import userRouter from "./modules/users/routes/user.route.js";
import resumeRouter from "./modules/resumes/routes/resume.route.js";

import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

/**
 * Global Middlewares
 */
app.use(helmet());
app.use(cors());
app.use(compression());

/**
 * Webhooks (MUST be before express.json())
 */
app.use(
    "/api/v1/webhooks",
    express.raw({ type: "application/json" }),
    userRouter
);

/**
 * Body Parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Clerk Middleware
 */
app.use(
    "/api",
    clerkMiddleware({
        publishableKey: env.CLERK_PUBLISHABLE_KEY,
    })
);

app.use(morgan("dev"));

/**
 * Routes
 */
app.use("/health", healthRouter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/resumes", resumeRouter);

/**
 * 404 Middleware
 */
app.use(notFoundHandler);

/**
 * Global Error Middleware
 */
app.use(errorHandler);

export default app;