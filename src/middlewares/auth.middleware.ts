import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";

// This middleware will check session 
// If user is not logged in, then it will return from here
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Please login first! We Check Login Stop Messing with me" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.user.id }
    });

    if (!user || user.status === "INACTIVE") {
      req.session.destroy(() => { });
      return res.status(403).json({ message: "Your account is deactivated." });
    }

    // Refresh role inside session to immediately revoke escalated privileges if changed
    req.session.user.role = user.role;

    return next();
  } catch (err) {
    return res.status(500).json({ message: "Server error during authentication." });
  }
};
