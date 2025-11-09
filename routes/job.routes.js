import express from "express";
import {
  createJob,
  getJobs,
  getJob,
  getMyJobs,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJob);

// Protected routes (Recruiters and Admins only)
router.post("/", authenticate, authorize("RECRUITER", "ADMIN"), createJob);
router.get(
  "/my/jobs",
  authenticate,
  authorize("RECRUITER", "ADMIN"),
  getMyJobs
);
router.put("/:id", authenticate, authorize("RECRUITER", "ADMIN"), updateJob);
router.delete("/:id", authenticate, authorize("RECRUITER", "ADMIN"), deleteJob);

export default router;
