import { Command } from "commander";
import { buildRankCommand } from "./rank.js";

export function buildRootCommand(): Command {
  return new Command()
    .name("iq")
    .description("Terminal-first CLI for international qualifications research.")
    .version("0.1.0")
    .addCommand(buildRankCommand());
}
