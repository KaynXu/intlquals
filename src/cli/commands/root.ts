import { Command } from "commander";
import { buildCacheCommand } from "./cache.js";
import { buildDoctorCommand } from "./doctor.js";
import { buildExportCommand } from "./export.js";
import { buildRankCommand } from "./rank.js";
import { buildSchoolCommand } from "./school.js";
import { buildSourceCommand } from "./source.js";

export function buildRootCommand(): Command {
  return new Command()
    .name("iq")
    .description("Terminal-first CLI for international qualifications research.")
    .version("0.1.0")
    .addCommand(buildSourceCommand())
    .addCommand(buildRankCommand())
    .addCommand(buildSchoolCommand())
    .addCommand(buildExportCommand())
    .addCommand(buildCacheCommand())
    .addCommand(buildDoctorCommand());
}
