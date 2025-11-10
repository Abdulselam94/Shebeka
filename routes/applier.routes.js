// routes/application.routes.js
import express from "express";
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats,
} from "../controllers/applier.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Candidate routes
router.post(
  "/job/:jobId/apply",
  authenticate,
  authorize("APPLIER"),
  applyToJob
);
router.get(
  "/my/applications",
  authenticate,
  authorize("APPLIER"),
  getMyApplications
);
router.put(
  "/:applicationId/withdraw",
  authenticate,
  authorize("APPLIER"),
  withdrawApplication
);

// Recruiter routes
router.get(
  "/job/:jobId/applications",
  authenticate,
  authorize("RECRUITER", "ADMIN"),
  getJobApplications
);
router.put(
  "/:applicationId/status",
  authenticate,
  authorize("RECRUITER", "ADMIN"),
  updateApplicationStatus
);
router.get(
  "/stats",
  authenticate,
  authorize("RECRUITER", "ADMIN"),
  getApplicationStats
);

export default router;
