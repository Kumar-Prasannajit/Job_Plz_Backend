import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./config/env.js";

import healthRouter from "./routes/health.route.js";
import dashboardRoutes from "../src/modules/admin/routes/dashboard.route.js";
import userRouter from "./modules/users/routes/user.route.js";
import resumeRouter from "./modules/resumes/routes/resume.route.js";
import scraperRoutes from "./modules/scraper/routes/scraper.routes.js";

import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import router from "./routes/health.route.js";

const app = express();

/**
 * Global Middlewares
 */
app.use(helmet());
app.use(cors());
app.use(compression());

/**
 * Clerk Middleware (MUST be global and early, before body parsers)
 * Required for AsyncLocalStorage to propagate through nested routers
 */
app.use(
  clerkMiddleware({
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
    secretKey: env.CLERK_SECRET_KEY,
  }),
);

/**
 * Webhooks (MUST be before express.json())
 */
app.use(
  "/api/v1/webhooks",
  express.raw({ type: "application/json" }),
  userRouter,
);

/**
 * Body Parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

/**
 * Routes
 */
app.use("/health", healthRouter);
app.use("/api/v1/admin/dashboard", dashboardRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/scrapers", scraperRoutes);

/**
 * 404 Middleware
 */
app.use(notFoundHandler);

/**
 * Global Error Middleware
 */
app.use(errorHandler);

export default app;
