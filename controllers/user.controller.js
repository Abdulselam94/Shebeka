// controllers/user.controller.js
import { prisma } from "../config/db.js";

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        resume: true,
        bio: true,
        skills: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, location } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        bio: bio || undefined,
        location: location || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        location: true,
        skills: true,
        avatar: true,
        resume: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Update resume
export const updateResume = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({ message: "Resume URL is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { resume: resumeUrl },
      select: {
        id: true,
        name: true,
        resume: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Resume updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update resume error:", error);
    res.status(500).json({ message: "Failed to update resume" });
  }
};

// Update avatar
export const updateAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ message: "Avatar URL is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        name: true,
        avatar: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update avatar error:", error);
    res.status(500).json({ message: "Failed to update avatar" });
  }
};

// Add skill
export const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({ message: "Skill is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { skills: true },
    });

    const currentSkills = user.skills || [];

    if (currentSkills.includes(skill)) {
      return res.status(400).json({ message: "Skill already exists" });
    }

    const updatedSkills = [...currentSkills, skill];

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { skills: updatedSkills },
      select: {
        id: true,
        name: true,
        skills: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Skill added successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Add skill error:", error);
    res.status(500).json({ message: "Failed to add skill" });
  }
};

// Remove skill
export const removeSkill = async (req, res) => {
  try {
    const { skill } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { skills: true },
    });

    const currentSkills = user.skills || [];
    const updatedSkills = currentSkills.filter((s) => s !== skill);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { skills: updatedSkills },
      select: {
        id: true,
        name: true,
        skills: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Skill removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Remove skill error:", error);
    res.status(500).json({ message: "Failed to remove skill" });
  }
};

// Get public profile (for recruiters viewing candidates)
export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
        role: "APPLIER", // Only candidates have public profiles
      },
      select: {
        id: true,
        name: true,
        bio: true,
        skills: true,
        location: true,
        resume: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.json({
      message: "Public profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({ message: "Failed to fetch public profile" });
  }
};
