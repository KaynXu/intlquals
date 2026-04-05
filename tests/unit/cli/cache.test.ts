import { describe, expect, it } from "vitest";
import { buildCacheCommand } from "../../../src/cli/commands/cache.js";

describe("cache command", () => {
  it("exposes the status subcommand", () => {
    const command = buildCacheCommand();
    expect(command.commands.map((item) => item.name())).toContain("status");
  });
});
