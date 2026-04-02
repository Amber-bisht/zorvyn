import { z } from "zod";

// Create Record Schema
export const recordSchema = z.object({
  amount: z.number().positive("Amount should be greater than zero!"),
  type: z.enum(["INCOME", "EXPENSE"], { message: "Only INCOME or EXPENSE is allowed" }),
  category: z.string().min(2, "Category name should be at least 2 characters long"),
  description: z.string().optional(),
  date: z.string().datetime().optional(), // ISO string date handle karega
});

// Update Record Schema (Partial because not everything needs to be updated)
export const updateRecordSchema = recordSchema.partial();

// Query Schema for GET /api/records
export const querySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.enum(["amount", "date", "category", "type"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
  limit: z.preprocess((val) => Number(val), z.number().min(1).max(100).default(10)),
});
