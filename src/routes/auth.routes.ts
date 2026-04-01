import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// to check user is logged in or not
router.get("/me", isAuthenticated, (req: express.Request, res: express.Response) => {
  res.json({ user: req.session.user });
});

export default router;
