import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../config/db.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        bio: true,
        skills: true,
        location: true,
      },
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Add authorization function
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }
    next();
  };
};

// Optional: Check if user owns the resource
export const authorizeOwner = (resourceOwnerId) => {
  return (req, res, next) => {
    if (
      req.user.id !== parseInt(resourceOwnerId) &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        message: "Access denied. Not resource owner.",
      });
    }
    next();
  };
};
