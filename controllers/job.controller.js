import { prisma } from "../config/db.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      category,
      tags,
      isRemote,
      expiresAt,
    } = req.body;

    // Validation
    if (!title || !description || !location) {
      return res.status(400).json({
        message: "Title, description, and location are required",
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements: requirements || "",
        salary: salary || null,
        location,
        jobType: jobType || "FULL_TIME",
        experienceLevel: experienceLevel || "MID",
        category: category || "General",
        tags: tags || [],
        isRemote: isRemote || false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        recruiterId: req.user.id,
      },
      include: {
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Failed to create job" });
  }
};

// Get all jobs with filters
export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      jobType,
      experienceLevel,
      isRemote,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = { status: "OPEN" };

    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    // Add other filters
    if (category) where.category = category;
    if (jobType) where.jobType = jobType;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (isRemote !== undefined) where.isRemote = isRemote === "true";

    const jobs = await prisma.job.findMany({
      where,
      include: {
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(limit),
    });

    const total = await prisma.job.count({ where });

    res.json({
      message: "Jobs fetched successfully",
      jobs,
      pagination: {
        current: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalJobs: total,
        hasNext: page < Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// Get single job
export const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            skills: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({
      message: "Job fetched successfully",
      job,
    });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

// Get recruiter's jobs
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { recruiterId: req.user.id },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      message: "Your jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.error("Get my jobs error:", error);
    res.status(500).json({ message: "Failed to fetch your jobs" });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if job exists and user owns it
    const existingJob = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (existingJob.recruiterId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id) },
      data: req.body,
      include: {
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Failed to update job" });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if job exists and user owns it
    const existingJob = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (existingJob.recruiterId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await prisma.job.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};
