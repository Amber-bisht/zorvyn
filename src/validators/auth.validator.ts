import { z } from "zod";

// Register schema validation logic
export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Should be 8 characters long or more")
    .max(30, "Should be 30 characters long or less")
    .regex(/[A-Z]/, "Should contain at least one uppercase letter")
    .regex(/[a-z]/, "Should contain at least one lowercase letter")
    .regex(/[0-9]/, "Should contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Should contain at least one special character"),
  name: z.string().min(2, "Name Can't be of Of less than 2 characters"),
});

// Login schema logic
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Should be 8 characters long or more"),
});
