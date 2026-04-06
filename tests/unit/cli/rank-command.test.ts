import { describe, expect, it } from "vitest";
import { buildRankCommand } from "../../../src/cli/commands/rank.js";

describe("rank command", () => {
  it("nests admitranking commands under rank", () => {
    const command = buildRankCommand();
    const admitranking = command.commands.find((subcommand) => subcommand.name() === "admitranking");

    expect(admitranking).toBeDefined();
    expect(admitranking?.commands.map((subcommand) => subcommand.name())).toEqual([
      "list",
      "show",
      "school"
    ]);
  });
});
