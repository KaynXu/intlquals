import { Command } from "commander";
import { compareSchools } from "../../domain/services/compare-schools.js";
import { fetchSchool, searchSchools } from "../../domain/services/fetch-schools.js";

export function buildSchoolCommand(): Command {
  const command = new Command("school").description("Search and inspect schools.");

  command
    .command("search")
    .option("--keyword <keyword>", "Search keyword", "")
    .action(async (options: { keyword: string }) => {
      console.log(JSON.stringify(await searchSchools(options.keyword), null, 2));
    });

  command.command("show").argument("<comId>").action(async (comId: string) => {
    console.log(JSON.stringify(await fetchSchool(comId), null, 2));
  });

  command.command("compare").argument("<ids...>").action(async (ids: string[]) => {
    const schools = await Promise.all(ids.map((id) => fetchSchool(id)));
    console.log(JSON.stringify(compareSchools(schools), null, 2));
  });

  return command;
}
