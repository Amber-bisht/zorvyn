import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { UserRole } from "@prisma/client";

// Authentication & User Logic

export class AuthService {
  // Check if email already exists
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  // Create Naya User (Hashing included)
  static async registerUser(data: { email: string, name?: string, passwordHash: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        role: UserRole.VIEWER, // Default role
      },
    });
  }

  // Verify password with hash
  static async verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  // Generate hash for password
  static async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
