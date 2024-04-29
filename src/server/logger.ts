import winston from "winston";

export const log = winston.createLogger({ level: "info" });

if (process.env["NODE_ENV"] === "production")
    log.add(new winston.transports.File({ filename: "error.log", level: "error" }));
else
    log.add(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
    );

log.info(`NODE_ENV: ${process.env["NODE_ENV"]}`);
log.info("Logger initialized");
