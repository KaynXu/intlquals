import { writeFile } from "node:fs/promises";
import { Command } from "commander";
import { renderExport } from "../../domain/services/export-data.js";
import { fetchRankingEntries } from "../../domain/services/fetch-rankings.js";
import { fetchSchool, searchSchools } from "../../domain/services/fetch-schools.js";

export function buildExportCommand(): Command {
  const command = new Command("export").description("Export rankings and schools.");

  command
    .command("rank")
    .argument("<rankId>")
    .requiredOption("--format <format>", "json|csv|md")
    .requiredOption("--output <output>", "Output file path")
    .action(
      async (
        rankId: string,
        options: { format: "json" | "csv" | "md"; output: string }
      ) => {
        const rows = await fetchRankingEntries(rankId);
        await writeFile(
          options.output,
          renderExport(rows as unknown as Array<Record<string, unknown>>, options.format),
          "utf8"
        );
      }
    );

  command
    .command("school")
    .argument("<comId>")
    .requiredOption("--format <format>", "json|csv|md")
    .requiredOption("--output <output>", "Output file path")
    .action(
      async (
        comId: string,
        options: { format: "json" | "csv" | "md"; output: string }
      ) => {
        const row = await fetchSchool(comId);
        await writeFile(
          options.output,
          renderExport([row as unknown as Record<string, unknown>], options.format),
          "utf8"
        );
      }
    );

  command
    .command("search")
    .option("--keyword <keyword>", "Search keyword", "")
    .requiredOption("--format <format>", "json|csv|md")
    .requiredOption("--output <output>", "Output file path")
    .action(
      async (options: {
        keyword: string;
        format: "json" | "csv" | "md";
        output: string;
      }) => {
        const rows = await searchSchools(options.keyword);
        await writeFile(
          options.output,
          renderExport(rows as unknown as Array<Record<string, unknown>>, options.format),
          "utf8"
        );
      }
    );

  return command;
}
