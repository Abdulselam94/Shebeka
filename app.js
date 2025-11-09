// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

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

app.use(errorHandler);

//route
app.use("/api/auth", authRoutes);

// placeholder route
app.get("/", (req, res) => {
  res.json({ message: "Job Portal Backend — API is running" });
});

export default app;
