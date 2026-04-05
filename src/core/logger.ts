import pino from "pino";

export function createLogger(level = process.env.IQ_LOG_LEVEL ?? "info") {
  return pino({
    level,
    transport:
      process.env.NODE_ENV === "test"
        ? undefined
        : {
            target: "pino-pretty",
            options: {
              colorize: true
            }
          }
  });
}
