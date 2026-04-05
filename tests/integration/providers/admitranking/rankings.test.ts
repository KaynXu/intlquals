import { describe, expect, it } from "vitest";
import { mapRankingListItem } from "../../../../src/providers/admitranking/mapper.js";

describe("admitranking mapper", () => {
  it("maps a ranking list item into the shared model", () => {
    const ranking = mapRankingListItem({
      id: 52,
      title: "翠鹿最佳公立国际部排名",
      etitle: "Cuilu Best Public Intl Departments",
      year: 2026
    });

    expect(ranking.id).toBe("52");
    expect(ranking.titleEn).toBe("Cuilu Best Public Intl Departments");
  });
});
