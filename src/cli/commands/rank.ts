import { Command } from "commander";
import {
  fetchAdmitRankingShow,
  fetchRankingList
} from "../../domain/admitranking/services/fetch-rankings.js";
import { fetchSchool } from "../../domain/admitranking/services/fetch-schools.js";

export function buildRankCommand(): Command {
  const command = new Command("rank").description("Fetch and inspect rankings.");
  const admitranking = new Command("admitranking").description(
    "Browse rankings and schools collected by AdmitRanking."
  );

  admitranking.command("list").action(async () => {
    console.log(JSON.stringify(await fetchRankingList(), null, 2));
  });

  admitranking
    .command("show")
    .argument("<rankId>")
    .option("--page <page>", "Page number", "1")
    .option("--size <size>", "Page size", "20")
    .action(async (rankId: string, options: { page: string; size: string }) => {
      console.log(
        JSON.stringify(
          await fetchAdmitRankingShow(rankId, {
            page: Number(options.page),
            size: Number(options.size)
          }),
          null,
          2
        )
      );
    });

  admitranking.command("school").argument("<schoolId>").action(async (schoolId: string) => {
    console.log(JSON.stringify(await fetchSchool(schoolId), null, 2));
  });

  command.addCommand(admitranking);

  return command;
}
