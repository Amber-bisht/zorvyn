import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { UserStatus, UserRole } from "@prisma/client";

// Admin Level User Management Controller 

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    return sendSuccess(res, "User list fetched successfully", users);
  } catch (error: any) {
    return sendError(res, "User list fetch failed", error, 500);
  }
};

// Update User Status
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(UserStatus).includes(status as UserStatus)) {
      return sendError(res, "Invalid status value. Use ACTIVE or INACTIVE", null, 400);
    }

    const updatedUser = await UserService.updateStatus(id as string, status as UserStatus);
    return sendSuccess(res, `User status updated to ${status}`, updatedUser);
  } catch (error: any) {
    return sendError(res, "Status update failed", error, 400);
  }
};

// Update User Role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role as UserRole)) {
      return sendError(res, "Invalid role. Use ADMIN, ANALYST, or VIEWER.", null, 400);
    }

    // Prevent Admin from mistakenly downgrading themselves
    if (req.session?.user?.id === id) {
      return sendError(res, "Action Denied: You cannot update your own master role.", null, 403);
    }

    const updatedUser = await UserService.updateRole(id as string, role as UserRole);
    return sendSuccess(res, `User role granted: ${role}`, updatedUser);
  } catch (error: any) {
    return sendError(res, "Role update failed", error, 400);
  }
};
