import { describe, expect, it } from "vitest";
import { buildRootCommand } from "../../../src/cli/commands/root.js";

describe("root command", () => {
  it("renders the product description", () => {
    const command = buildRootCommand();
    expect(command.description()).toContain("international qualifications");
  });
});
