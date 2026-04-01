import express from "express";
import { getUsers, updateUserStatus, updateUserRole } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Admin Only Routes for User Management
router.get("/", isAuthenticated, checkRole([UserRole.ADMIN]), getUsers);
router.patch("/:id/status", isAuthenticated, checkRole([UserRole.ADMIN]), updateUserStatus);
router.patch("/:id/role", isAuthenticated, checkRole([UserRole.ADMIN]), updateUserRole);

export default router;
