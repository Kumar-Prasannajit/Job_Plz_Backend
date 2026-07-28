import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import healthRouter from "./routes/health.route.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRouter from "./modules/users/routes/user.route.js";

const app = express();

/**
 * Global Middlewares
 */
app.use(helmet());

app.use(cors());

app.use(compression());
app.use(
    "/api/v1/webhooks",
    express.raw({ type: "application/json" }),
    userRouter
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// Routes
app.use("/health", healthRouter);



//404 Middleware
 app.use(notFoundHandler);

//Global Error Middleware
app.use(errorHandler);

export default app;