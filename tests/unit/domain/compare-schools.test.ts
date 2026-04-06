import { describe, expect, it } from "vitest";
import { compareSchools } from "../../../src/domain/services/compare-schools.js";

describe("compareSchools", () => {
  it("projects comparable school fields", () => {
    const rows = compareSchools([
      {
        id: "1",
        name: "A",
        provider: "admitranking",
        curricula: ["AP"],
        tags: [],
        stats: {},
        city: "Shanghai"
      },
      {
        id: "2",
        name: "B",
        provider: "admitranking",
        curricula: ["IB"],
        tags: [],
        stats: {},
        city: "Beijing"
      }
    ]);

    expect(rows[0]).toEqual({
      id: "1",
      name: "A",
      city: "Shanghai",
      curricula: "AP"
    });
  });
});
