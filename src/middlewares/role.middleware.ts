import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";

// Middleware to check if user has required role
// allowedRoles: [ADMIN, ANALYST, etc]
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.session.user;

    // session check
    if (!user) {
      return res.status(401).json({ message: "Login first" });
    }

    // Role verification
    if (allowedRoles.includes(user.role)) {
      return next();
    }

    // unauthorized role
    res.status(403).json({
      message: `You are not authorized to perform this action. Your role: ${user.role}. Allowed roles: ${allowedRoles.join(", ")}`
    });
  };
};
