import express from "express";
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
} from "../controllers/dashboard.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Dashboard Analytics Routes
// authMiddleware ensures the user is logged in
router.get("/summary", isAuthenticated, getSummary);
router.get("/categories", isAuthenticated, getCategoryBreakdown);
router.get("/trends", isAuthenticated, getMonthlyTrends);
router.get("/recent", isAuthenticated, checkRole([UserRole.ADMIN, UserRole.ANALYST]), getRecentActivity);

export default router;
