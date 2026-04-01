import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { recordSchema, updateRecordSchema } from "../validators/record.validator.js";

// Finance Records logic here Incomes aur Expenses)

// Get all records (with filtering)
export const getRecords = async (req: Request, res: Response) => {
  try {
    const { type, category, startDate, endDate, sortBy, order } = req.query;

    // Filtration object
    const filter: any = {};
    if (type) filter.type = type as 'INCOME' | 'EXPENSE';
    if (category) filter.category = category as string;

    // Date range filtering
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.gte = new Date(startDate as string);
      if (endDate) filter.date.lte = new Date(endDate as string);
    }

    // Records fetch logic
    const records = await prisma.record.findMany({
      where: filter,
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        [sortBy ? (sortBy as string) : 'date']: order ? (order as string) : 'desc'
      }
    });

    res.json(records);
  } catch (error: any) {
    res.status(500).json({ message: "Records fetch error - Unable to fetch records", error: error.message });
  }
};

// Create New Record (ADMIN Only via Routes)
export const createRecord = async (req: Request, res: Response) => {
  try {
    const validatedData = recordSchema.parse(req.body);
    const userId = req.session.user!.id; // Authenticated user ID

    const record = await prisma.record.create({
      data: {
        amount: validatedData.amount,
        type: validatedData.type,
        category: validatedData.category,
        description: validatedData.description,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        userId,
      },
    });

    res.status(201).json({ message: "New record saved successfully!", record });
  } catch (error: any) {
    res.status(400).json({ message: "Creation failed", error: error.message || error });
  }
};

// Update existing record
export const updateRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateRecordSchema.parse(req.body);

    const updatedRecord = await prisma.record.update({
      where: { id: id as string },
      data: {
        ...validatedData,
        date: validatedData.date ? new Date(validatedData.date) : undefined,
      },
    });

    res.json({ message: "Record updated successfully", record: updatedRecord });
  } catch (error: any) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

// Delete record entry
export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.record.delete({
      where: { id: id as string },
    });

    res.json({ message: "Record deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: "Delete failed", error: error.message });
  }
};
