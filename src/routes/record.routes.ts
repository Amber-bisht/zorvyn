import express from "express";
import {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord
} from "../controllers/record.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", isAuthenticated, getRecords);
router.post("/", isAuthenticated, checkRole([UserRole.ADMIN]), createRecord);
router.put("/:id", isAuthenticated, checkRole([UserRole.ADMIN]), updateRecord);
router.delete("/:id", isAuthenticated, checkRole([UserRole.ADMIN]), deleteRecord);

export default router;
