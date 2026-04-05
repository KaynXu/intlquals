import os from "node:os";
import path from "node:path";

export interface AppConfig {
  dataDir: string;
  cacheDbPath: string;
  timeoutMs: number;
  logLevel: string;
}

export function resolveConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const dataDir = env.IQ_DATA_DIR ?? path.join(os.homedir(), ".intlquals");
  const timeoutMs = Number(env.IQ_TIMEOUT_MS ?? "15000");
  const logLevel = env.IQ_LOG_LEVEL ?? "info";

  return {
    dataDir,
    cacheDbPath: path.join(dataDir, "cache.sqlite"),
    timeoutMs,
    logLevel
  };
}
