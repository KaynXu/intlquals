import { describe, expect, it } from "vitest";
import { toMarkdownTable } from "../../../../src/infra/serializers/markdown.js";

describe("toMarkdownTable", () => {
  it("renders a simple markdown table", () => {
    const output = toMarkdownTable([{ rank: 1, school: "SCIE" }]);
    expect(output).toContain("| rank | school |");
  });
});
