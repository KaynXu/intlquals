import { Command } from "commander";
import {
  fetchRanking,
  fetchRankingEntries,
  fetchRankingList
} from "../../domain/services/fetch-rankings.js";

export function buildRankCommand(): Command {
  const command = new Command("rank").description("Fetch and inspect rankings.");

  command.command("list").action(async () => {
    console.log(JSON.stringify(await fetchRankingList(), null, 2));
  });

  command.command("show").argument("<rankId>").action(async (rankId: string) => {
    console.log(JSON.stringify(await fetchRanking(rankId), null, 2));
  });

  command
    .command("entries")
    .argument("<rankId>")
    .option("--page <page>", "Page number", "1")
    .option("--size <size>", "Page size", "20")
    .action(async (rankId: string, options: { page: string; size: string }) => {
      console.log(
        JSON.stringify(
          await fetchRankingEntries(rankId, Number(options.page), Number(options.size)),
          null,
          2
        )
      );
    });

  return command;
}
