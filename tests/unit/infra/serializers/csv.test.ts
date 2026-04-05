import { describe, expect, it } from "vitest";
import { toCsv } from "../../../../src/infra/serializers/csv.js";

describe("toCsv", () => {
  it("serializes rows with a header", () => {
    const output = toCsv([{ id: 1, name: "Shanghai High School" }]);
    expect(output).toContain("id,name");
    expect(output).toContain("1,Shanghai High School");
  });
});
