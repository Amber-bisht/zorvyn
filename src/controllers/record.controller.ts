import { Request, Response } from "express";
import { RecordService } from "../services/record.service.js";
import { recordSchema, updateRecordSchema, querySchema } from "../validators/record.validator.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { RecordType } from "@prisma/client";

// Record CRUD handler - Business logic in RecordService

// Get all records (with filtering and pagination)
export const getRecords = async (req: Request, res: Response) => {
  try {
    const validatedQuery = querySchema.parse(req.query);

    const result = await RecordService.getAll({
      type: validatedQuery.type as RecordType,
      category: validatedQuery.category,
      startDate: validatedQuery.startDate,
      endDate: validatedQuery.endDate,
      sortBy: validatedQuery.sortBy,
      order: validatedQuery.order,
      page: validatedQuery.page,
      limit: validatedQuery.limit,
    });

    return sendSuccess(res, "Records fetched successfully", {
      meta: {
        total: result.total,
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        totalPages: Math.ceil(result.total / validatedQuery.limit),
      },
      data: result.records,
    });
  } catch (error: any) {
    return sendError(res, "Unable to fetch records", error, 500);
  }
};

// Create New Record
export const createRecord = async (req: Request, res: Response) => {
  try {
    const validatedData = recordSchema.parse(req.body);
    const userId = req.session.user!.id;

    const record = await RecordService.create({
      ...validatedData,
      category: validatedData.category.toLowerCase(),
      type: validatedData.type as RecordType,
      userId,
    });

    return sendSuccess(res, "New record saved successfully!", record, 201);
  } catch (error: any) {
    return sendError(res, "Record creation failed", error);
  }
};

// Update existing record
export const updateRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateRecordSchema.parse(req.body);

    const record = await RecordService.update(id as string, validatedData);
    return sendSuccess(res, "Record updated successfully", record);
  } catch (error: any) {
    return sendError(res, "Update failed", error);
  }
};

// Soft Delete record entry
export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await RecordService.softDelete(id as string);
    return sendSuccess(res, "Record deleted successfully (Soft Deleted)");
  } catch (error: any) {
    return sendError(res, "Delete failed", error);
  }
};
