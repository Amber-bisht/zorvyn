import "dotenv/config";
import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/record.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import userRoutes from "./routes/user.routes.js";
import { pool } from "./config/db.config.js";
import prisma from "./config/prisma.js";
import helmet from "helmet";
import cors from "cors";

const app = express();
const PostgresStore = pgSession(session);

// Security and utility Middlewares
app.use(helmet());
app.use(cors({
  origin: true, // Allow all for assignment, but can be restricted
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session : Neon DB 
app.use(
  session({
    store: new PostgresStore({
      pool: pool as any, // Use central pool instance
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Valid for 1 day , I can change it later if company wanted
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

// Auth routes mount
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong on the server!", 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 3000;

// root 
app.get("/", (req: express.Request, res: express.Response) => {
  res.send(`welcome to backend server of Finance Data Processing and Access Control Backend assigemnt by amberbisht`);
});

app.get("/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "ok", message: "Backend is running fine lol" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} , btw I am Amber`);
});

export default app;
