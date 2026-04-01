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
    // Always output to Console so Docker can capture stdout/stderr via 'docker logs'
    new winston.transports.Console({
      format: combine(
        process.env.NODE_ENV !== "production" ? colorize() : winston.format.uncolorize(),
        logFormat
      ),
    })
  ],
});

