import prisma from "../config/prisma.js";
import { RecordType } from "@prisma/client";

// Dashboard Analytics Service

export class DashboardService {
  // Get Summary (Totals and Balance)
  static async getSummary(userId: string) {
    const [income, expense] = await Promise.all([
      prisma.record.aggregate({
        _sum: { amount: true },
        where: { type: "INCOME", isDeleted: false, userId },
      }),
      prisma.record.aggregate({
        _sum: { amount: true },
        where: { type: "EXPENSE", isDeleted: false, userId },
      }),
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  // Get Breakdown by Category
  static async getCategoryBreakdown(userId: string, type?: RecordType) {
    return prisma.record.groupBy({
      by: ["category"],
      _sum: { amount: true },
      where: {
        isDeleted: false,
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: {
        _sum: { amount: "desc" },
      },
    });
  }

  // Monthly trends (Simplified)
  static async getMonthlyTrends(userId: string) {
    const currentYear = new Date().getFullYear();
    const records = await prisma.record.findMany({
      where: {
        isDeleted: false,
        userId,
        date: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        }
      },
      select: { amount: true, type: true, date: true }
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trends: any = {};
    months.forEach(m => trends[m] = { income: 0, expense: 0 });

    records.forEach(r => {
      const monthName = months[r.date.getMonth()];
      if (r.type === "INCOME") trends[monthName].income += r.amount;
      else trends[monthName].expense += r.amount;
    });

    return trends;
  }

  // Recent Activity
  static async getRecentActivity(userId: string, limit: number = 5) {
    return prisma.record.findMany({
      where: { isDeleted: false, userId },
      take: limit,
      orderBy: { date: "desc" },
      include: { user: { select: { name: true, email: true } } }
    });
  }
}
