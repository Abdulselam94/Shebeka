// controllers/applier.controller.js
import { prisma } from "../config/db.js";

// Apply to a job
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resume } = req.body;

    // Check if job exists and is open
    const job = await prisma.job.findUnique({
      where: {
        id: parseInt(jobId),
        status: "OPEN",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or no longer accepting applications",
      });
    }

    // Check if user already applied to this job
    const existingApplication = await prisma.application.findUnique({
      where: {
        applierId_jobId: {
          applierId: req.user.id,
          jobId: parseInt(jobId),
        },
      },
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this job",
      });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        coverLetter: coverLetter || "",
        resume: resume || req.user.resume, // Use profile resume if not provided
        applierId: req.user.id,
        jobId: parseInt(jobId),
        status: "PENDING",
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,

            recruiter: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        applier: {
          select: {
            id: true,
            name: true,
            email: true,
            skills: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply to job error:", error);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

// Get user's applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { applierId: req.user.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,

            location: true,
            jobType: true,
            salary: true,
            recruiter: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// Get applications for a job (recruiter only)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists and user owns it
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to view applications for this job",
      });
    }

    const applications = await prisma.application.findMany({
      where: { jobId: parseInt(jobId) },
      include: {
        applier: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            skills: true,
            resume: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      message: "Job applications fetched successfully",
      applications,
    });
  } catch (error) {
    console.error("Get job applications error:", error);
    res.status(500).json({ message: "Failed to fetch job applications" });
  }
};

// Update application status (recruiter only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "PENDING",
      "REVIEWED",
      "ACCEPTED",
      "REJECTED",
      "WITHDRAWN",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Must be: PENDING, REVIEWED, ACCEPTED, REJECTED, or WITHDRAWN",
      });
    }

    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: {
        job: true,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if user owns the job
    if (application.job.recruiterId !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this application",
      });
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: { status },
      include: {
        job: {
          select: {
            title: true,
            recruiter: {
              select: {
                name: true,
              },
            },
          },
        },
        applier: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Failed to update application status" });
  }
};

// Withdraw application (candidate only)
export const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Check if application exists
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if user owns the application
    if (application.applierId !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to withdraw this application",
      });
    }

    // Update status to withdrawn
    await prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: { status: "WITHDRAWN" },
    });

    res.json({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Withdraw application error:", error);
    res.status(500).json({ message: "Failed to withdraw application" });
  }
};

// Get application statistics for recruiter
export const getApplicationStats = async (req, res) => {
  try {
    const stats = await prisma.application.groupBy({
      by: ["status"],
      where: {
        job: {
          recruiterId: req.user.id,
        },
      },
      _count: {
        id: true,
      },
    });

    const totalApplications = await prisma.application.count({
      where: {
        job: {
          recruiterId: req.user.id,
        },
      },
    });

    res.json({
      message: "Application statistics fetched successfully",
      stats: {
        byStatus: stats,
        total: totalApplications,
      },
    });
  } catch (error) {
    console.error("Get application stats error:", error);
    res.status(500).json({ message: "Failed to fetch application statistics" });
  }
};
