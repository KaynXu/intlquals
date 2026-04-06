import { describe, expect, it } from "vitest";
import { buildRankCommand } from "../../../src/cli/commands/rank.js";

describe("rank admitranking command", () => {
  it("keeps list, show, and school as the only subcommands", () => {
    const command = buildRankCommand();
    const admitranking = command.commands.find((subcommand) => subcommand.name() === "admitranking");

    expect(admitranking?.commands.map((subcommand) => subcommand.name())).toEqual([
      "list",
      "show",
      "school"
    ]);
  });
});
