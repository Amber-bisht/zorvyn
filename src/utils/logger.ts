import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format string
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    // Output error logs to a separate file
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // Output all logs to combined file
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// If we're not in production then log to the console with colors
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    })
  );
}
