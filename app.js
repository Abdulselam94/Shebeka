// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/applier.routes.js";

import { errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ✅ ROUTES - SHOULD COME BEFORE ERROR HANDLER
app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// placeholder route
app.get("/", (req, res) => {
  res.json({ message: "Job Portal Backend — API is running" });
});

// ✅ ERROR HANDLER - MUST COME AFTER ALL ROUTES
app.use(errorHandler);

export default app;
