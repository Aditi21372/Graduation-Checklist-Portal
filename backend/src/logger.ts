// logger.ts
import winston from "winston";
import path from "path";

const logFilePath = path.join(__dirname, "rule-logs.log");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
    )
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath }),
    new winston.transports.Console() // Optional: also log to console
  ],
});

export default logger;
