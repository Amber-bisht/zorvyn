import express from "express";
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
} from "../controllers/dashboard.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Dashboard Analytics Routes
// authMiddleware ensures the user is logged in
router.get("/summary", isAuthenticated, getSummary);
router.get("/categories", isAuthenticated, getCategoryBreakdown);
router.get("/trends", isAuthenticated, getMonthlyTrends);
router.get("/recent", isAuthenticated, getRecentActivity);

export default router;
