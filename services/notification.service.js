// services/notification.service.js
import prisma from "../config/db.js";

// Helper function to create notifications
const createNotification = async (userId, notificationData) => {
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

// Service functions to create specific types of notifications
export const NotificationService = {
  // Application status update
  async applicationStatusUpdate(userId, applicationId, status, jobTitle) {
    const messages = {
      REVIEWED: `Your application for "${jobTitle}" has been reviewed`,
      ACCEPTED: `🎉 Congratulations! Your application for "${jobTitle}" has been accepted!`,
      REJECTED: `Your application for "${jobTitle}" was not selected`,
      WITHDRAWN: `You withdrew your application for "${jobTitle}"`,
    };

    return await createNotification(userId, {
      title: "Application Update",
      message:
        messages[status] ||
        `Your application for "${jobTitle}" has been updated`,
      type: "APPLICATION_UPDATE",
      relatedId: applicationId,
      relatedType: "APPLICATION",
    });
  },

  // New job match based on skills
  async newJobMatch(userId, jobId, jobTitle, company) {
    return await createNotification(userId, {
      title: "New Job Match",
      message: `New job "${jobTitle}" at ${company} matches your skills!`,
      type: "NEW_JOB_MATCH",
      relatedId: jobId,
      relatedType: "JOB",
    });
  },

  // Interview invitation
  async interviewInvite(userId, jobId, jobTitle, interviewDate) {
    return await createNotification(userId, {
      title: "Interview Invitation",
      message: `You've been invited for an interview for "${jobTitle}" on ${interviewDate}`,
      type: "INTERVIEW_INVITE",
      relatedId: jobId,
      relatedType: "JOB",
    });
  },

  // System alerts
  async systemAlert(userId, title, message) {
    return await createNotification(userId, {
      title,
      message,
      type: "SYSTEM_ALERT",
      relatedType: "SYSTEM",
    });
  },

  // Job expiring soon (for recruiters)
  async jobExpiring(userId, jobId, jobTitle) {
    return await createNotification(userId, {
      title: "Job Expiring Soon",
      message: `Your job posting "${jobTitle}" is expiring in 3 days`,
      type: "JOB_EXPIRING",
      relatedId: jobId,
      relatedType: "JOB",
    });
  },
};
