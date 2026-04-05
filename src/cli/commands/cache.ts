import { rm } from "node:fs/promises";
import { Command } from "commander";
import { resolveConfig } from "../../core/config.js";

export function buildCacheCommand(): Command {
  const command = new Command("cache").description("Inspect or clear local cache.");

  command.command("status").action(() => {
    console.log(JSON.stringify({ cacheDbPath: resolveConfig().cacheDbPath }, null, 2));
  });

  command.command("clear").action(async () => {
    await rm(resolveConfig().cacheDbPath, { force: true });
    console.log("Cache cleared.");
  });

  return command;
}
