import RedisLib from "ioredis";
import { logger } from "../utils/logger.js";

// Ensure compatibility with TS ESM module resolution
const Redis = (RedisLib as any).default || RedisLib;

// Initialize Redis client using environment variable or local fallback
export const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Centralized error and connection event logging
redisClient.on("connect", () => logger.info("Redis connected successfully"));
redisClient.on("error", (err: Error) => logger.error(`Redis connection error: ${err.message}`));
