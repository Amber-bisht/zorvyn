import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

// SSL is required for Neon DB
let dbUrl = process.env.DATABASE_URL;

// Safely remove channel_binding if present to avoid driver confusion
if (dbUrl && dbUrl.includes("channel_binding=require")) {
  dbUrl = dbUrl.replace("channel_binding=require", "channel_binding=disable");
}

if (!dbUrl) {
  throw new Error("DATABASE_URL is missing in .env");
}

export const pool = new Pool({
  connectionString: dbUrl,
  ssl: true, // Explicitly enable SSL
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased to 10s for reliability
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;
