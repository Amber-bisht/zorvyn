import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { RecordType } from "@prisma/client";

// Dashboard Analytics Handler

// 1. Get Financial Summary
export const getSummary = async (req: Request, res: Response) => {
  try {
    const summary = await DashboardService.getSummary();
    return sendSuccess(res, "Financial summary fetched successfully", summary);
  } catch (error: any) {
    return sendError(res, "Summary fetch error", error, 500);
  }
};

// 2. Get Category Breakdown
export const getCategoryBreakdown = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const breakdown = await DashboardService.getCategoryBreakdown(type as RecordType);
    return sendSuccess(res, "Category breakdown fetched successfully", breakdown);
  } catch (error: any) {
    return sendError(res, "Breakdown fetch error", error, 500);
  }
};

// 3. Get Monthly Trends
export const getMonthlyTrends = async (req: Request, res: Response) => {
  try {
    const trends = await DashboardService.getMonthlyTrends();
    return sendSuccess(res, "Monthly trends fetched successfully", trends);
  } catch (error: any) {
    return sendError(res, "Trends fetch error", error, 500);
  }
};

// 4. Get Recent Activity
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const recent = await DashboardService.getRecentActivity(5);
    return sendSuccess(res, "Recent activity fetched successfully", recent);
  } catch (error: any) {
    return sendError(res, "Recent activity fetch failed", error, 500);
  }
};
