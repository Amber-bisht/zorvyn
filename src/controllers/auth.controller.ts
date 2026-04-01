import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { registerSchema } from "../validators/auth.validator.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    // if mail is already exist then this module will run 
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Hey, This email is already registered With us try another email to register on zorvyn" });
    }

    // Password Hash i dont want to store user password in database without encrypting it
    const passwordHash = await bcrypt.hash(password, 10);

    // New user Create flow
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "VIEWER", // role viewer default ha
      },
    });

    res.status(201).json({ message: "User has been created successfully! Now you can login.", userId: newUser.id });
  } catch (error: any) {
    res.status(400).json({ 
      message: "Error while registering on zorvyn - ", 
      error: error.message || error
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // find user in db 
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    // Password Check against that user 
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    // Session set - i have use session instead jwt statales beacuse it is more secure for Finance Data Processing and Access Control Backend -:
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.json({ message: "Login success", user: req.session.user });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err: Error | null) => {
    if (err) {
      return res.status(500).json({ message: "Logout error" });
    }
    res.json({ message: "Logout success done" });
  });
};
