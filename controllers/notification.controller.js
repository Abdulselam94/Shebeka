// controllers/notification.controller.js

import prisma from "../config/db.js";

// Get user's notifications
export const getMyNotifications = async (req, res) => {
  try {
    console.log("🔍 DEBUG: Get notifications request received");
    console.log("🔍 DEBUG: User ID:", req.user.id);

    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = { userId: req.user.id };
    if (unreadOnly === "true") {
      where.isRead = false;
    }

    console.log("🔍 DEBUG: Where clause:", where);

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    });

    console.log("🔍 DEBUG: Notifications found:", notifications.length);

    const total = await prisma.notification.count({ where });
    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    console.log("🔍 DEBUG: Counts - total:", total, "unread:", unreadCount);

    res.json({
      message: "Notifications fetched successfully",
      notifications,
      unreadCount,
      pagination: {
        current: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalNotifications: total,
        hasNext: page < Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("❌ Get notifications error:", error);
    console.error("❌ Error details:", error.message);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Create a new notification (export this for the service)
export const createNotification = async (userId, notificationData) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        ...notificationData,
        userId,
      },
    });
    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(notificationId) },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(notificationId) },
      data: { isRead: true },
    });

    res.json({
      message: "Notification marked as read",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res
      .status(500)
      .json({ message: "Failed to mark all notifications as read" });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(notificationId) },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.notification.delete({
      where: { id: parseInt(notificationId) },
    });

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// Get notification statistics
export const getNotificationStats = async (req, res) => {
  try {
    const stats = await prisma.notification.groupBy({
      by: ["type"],
      where: { userId: req.user.id },
      _count: { id: true },
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    const totalCount = await prisma.notification.count({
      where: { userId: req.user.id },
    });

    res.json({
      message: "Notification statistics fetched successfully",
      stats: {
        byType: stats,
        unread: unreadCount,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error("Get notification stats error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch notification statistics" });
  }
};
