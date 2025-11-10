// routes/user.routes.js
import express from "express";
import {
  getProfile,
  updateProfile,
  updateResume,
  updateAvatar,
  addSkill,
  removeSkill,
  getPublicProfile,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// User profile routes (authenticated users)
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.put("/resume", authenticate, updateResume);
router.put("/avatar", authenticate, updateAvatar);

// Skills management (authenticated users)
router.post("/skills", authenticate, addSkill);
router.delete("/skills/:skill", authenticate, removeSkill);

// Public profile route (for recruiters viewing candidates)
router.get(
  "/public/:userId",
  authenticate,
  authorize("RECRUITER", "ADMIN"),
  getPublicProfile
);

export default router;
