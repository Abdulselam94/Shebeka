// routes/notification.routes.js
import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationStats,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.get("/", authenticate, getMyNotifications);
router.get("/stats", authenticate, getNotificationStats);
router.put("/:notificationId/read", authenticate, markAsRead);
router.put("/read-all", authenticate, markAllAsRead);
router.delete("/:notificationId", authenticate, deleteNotification);

export default router;
