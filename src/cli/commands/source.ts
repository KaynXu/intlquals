import { Command } from "commander";
import { createProviderRegistry } from "../../providers/registry.js";

export function buildSourceCommand(): Command {
  const command = new Command("source").description(
    "Inspect available data providers."
  );

  command
    .command("list")
    .description("List configured providers.")
    .action(() => {
      console.log(JSON.stringify(createProviderRegistry().list(), null, 2));
    });

  command
    .command("info")
    .argument("<provider>", "Provider id")
    .description("Show provider metadata.")
    .action((providerId: string) => {
      const provider = createProviderRegistry().get(providerId);
      console.log(JSON.stringify(provider ?? null, null, 2));
    });

  return command;
}
