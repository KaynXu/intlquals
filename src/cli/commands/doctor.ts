import { Command } from "commander";
import { resolveConfig } from "../../core/config.js";

export function buildDoctorCommand(): Command {
  return new Command("doctor")
    .description("Inspect local configuration and runtime settings.")
    .action(() => {
      const config = resolveConfig();
      console.log(JSON.stringify(config, null, 2));
    });
}
