import { Command } from "commander";
import {
  fetchAdmitRankingShow,
  fetchRankingList
} from "../../domain/admitranking/services/fetch-rankings.js";
import {
  availableSchoolSections,
  fetchSchoolSection
} from "../../domain/admitranking/services/fetch-schools.js";
import type { SchoolSectionName } from "../../domain/admitranking/models/school.js";

export function buildRankCommand(): Command {
  const command = new Command("rank").description("Fetch and inspect rankings.");
  const admitranking = new Command("admitranking").description(
    "Browse rankings and schools collected by AdmitRanking."
  );

  admitranking
    .command("list")
    .option("--year <year>", "List rankings from a specific year")
    .option("--all-years", "List discovered rankings across all years")
    .action(async (options: { year?: string; allYears?: boolean }) => {
      if (options.year && options.allYears) {
        throw new Error("Cannot use --year and --all-years together");
      }

      if (options.year) {
        const year = Number(options.year);

        if (!Number.isInteger(year)) {
          throw new Error(`Invalid year: ${options.year}`);
        }

        console.log(
          JSON.stringify(await fetchRankingList({ year }), null, 2)
        );
        return;
      }

      if (options.allYears) {
        console.log(JSON.stringify(await fetchRankingList({ allYears: true }), null, 2));
        return;
      }

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

  admitranking
    .command("school")
    .argument("<schoolId>")
    .argument("[section]")
    .description("Inspect school detail sections.")
    .addHelpText(
      "after",
      `\nAvailable sections:\n  ${availableSchoolSections.join("\n  ")}\n`
    )
    .action(async (schoolId: string, section?: string) => {
      if (!section) {
        console.log(
          JSON.stringify(await fetchSchoolSection(schoolId, "overview"), null, 2)
        );
        return;
      }

      if (!availableSchoolSections.includes(section as SchoolSectionName)) {
        throw new Error(`Unknown school section: ${section}`);
      }

      console.log(
        JSON.stringify(
          await fetchSchoolSection(schoolId, section as SchoolSectionName),
          null,
          2
        )
      );
    });

  command.addCommand(admitranking);

  return command;
}
