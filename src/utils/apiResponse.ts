import { Response } from "express";

// Standard API Response Structure
export const sendSuccess = (res: Response, message: string, data: any = null, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, message: string, error: any = null, statusCode: number = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || error,
  });
};
