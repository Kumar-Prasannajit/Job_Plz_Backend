import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import healthRouter from "./routes/health.route.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

/**
 * Global Middlewares
 */
app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

/**
 * Routes
 */
app.use("/health", healthRouter);

/**
 * 404 Middleware
 */
app.use(notFoundHandler);

/**
 * Global Error Middleware
 */
app.use(errorHandler);

export default app;