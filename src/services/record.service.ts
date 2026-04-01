import prisma from "../config/prisma.js";
import { RecordType } from "@prisma/client";

// Business Logic for Financial Records

export class RecordService {
  // Get Records with Filters and Pagination
  static async getAll(params: {
    type?: RecordType;
    category?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    order?: "asc" | "desc";
    page: number;
    limit: number;
  }) {
    const skip = (params.page - 1) * params.limit;
    const filter: any = { isDeleted: false };

    if (params.type) filter.type = params.type;
    if (params.category) filter.category = params.category;

    if (params.startDate || params.endDate) {
      filter.date = {};
      if (params.startDate) filter.date.gte = new Date(params.startDate);
      if (params.endDate) filter.date.lte = new Date(params.endDate);
    }

    const [records, total] = await Promise.all([
      prisma.record.findMany({
        where: filter,
        include: { user: { select: { name: true, email: true } } },
        orderBy: { [params.sortBy || "date"]: params.order || "desc" },
        skip,
        take: params.limit,
      }),
      prisma.record.count({ where: filter }),
    ]);

    return { records, total };
  }

  // Create Naya Record
  static async create(data: {
    amount: number;
    type: RecordType;
    category: string;
    description?: string;
    date?: string;
    userId: string;
  }) {
    return prisma.record.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });
  }

  // Update logic (ensure it's not soft-deleted)
  static async update(id: string, data: any) {
    return prisma.record.update({
      where: { id, isDeleted: false },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
  }

  // Soft Delete logic
  static async softDelete(id: string) {
    return prisma.record.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
