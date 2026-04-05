import { Command } from "commander";

export function buildRootCommand(): Command {
  return new Command()
    .name("iq")
    .description("Terminal-first CLI for international qualifications research.")
    .version("0.1.0");
}
