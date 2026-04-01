import { Request, Response } from "express";
import { registerSchema } from "../validators/auth.validator.js";
import { AuthService } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// Authentication Handler - Logic moved to AuthService

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existingUser = await AuthService.findUserByEmail(email);
    if (existingUser) {
      return sendError(res, "This email is already registered with us. Try another email on Zorvyn.", 400);
    }

    const passwordHash = await AuthService.hashPassword(password);
    const newUser = await AuthService.registerUser({ email, name, passwordHash });

    return sendSuccess(res, "User has been created successfully! Now you can login.", { userId: newUser.id }, 201);
  } catch (error: any) {
    return sendError(res, "Error while registering on Zorvyn", error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await AuthService.findUserByEmail(email);
    if (!user) {
      return sendError(res, "Invalid email or password!", null, 401);
    }

    const isPasswordValid = await AuthService.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return sendError(res, "Invalid email or password!", null, 401);
    }

    // Session handling logic (Request/Response layer)
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return sendSuccess(res, "Login success", { user: req.session.user });
  } catch (error) {
    return sendError(res, "Login error", error, 500);
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err: Error | null) => {
    if (err) {
      return sendError(res, "Logout error", err, 500);
    }
    return sendSuccess(res, "Logout success done");
  });
};
