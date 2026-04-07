import { describe, expect, it } from "vitest";
import { fetchAdmitRankingShow } from "../../../src/domain/admitranking/services/fetch-rankings.js";

describe("fetchAdmitRankingShow", () => {
  it("returns ranking metadata from the ranking list and the schools collected under that ranking", async () => {
    const provider = {
      listRankings: async () => [
        {
          id: "52",
          provider: "admitranking",
          title: "Best Public Intl Departments",
          year: 2026
        }
      ],
      listRankingEntries: async (rankId: string, page: number, size: number) => [
        {
          rankingId: rankId,
          entityId: "103",
          rank: 1,
          labels: ["AP"]
        }
      ]
    };

    const result = await fetchAdmitRankingShow("52", { page: 2, size: 10 }, provider);

    expect(result).toEqual({
      ranking: {
        id: "52",
        provider: "admitranking",
        title: "Best Public Intl Departments",
        year: 2026
      },
      schools: [
        {
          rankingId: "52",
          entityId: "103",
          rank: 1,
          labels: ["AP"]
        }
      ],
      page: 2,
      size: 10
    });
  });

  it("throws when the requested ranking does not exist in the ranking list", async () => {
    const provider = {
      listRankings: async () => [],
      listRankingEntries: async () => []
    };

    await expect(fetchAdmitRankingShow("999", {}, provider)).rejects.toThrow(
      "Ranking not found: 999"
    );
  });
});
