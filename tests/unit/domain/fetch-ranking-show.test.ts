import { describe, expect, it } from "vitest";
import { fetchAdmitRankingShow } from "../../../src/domain/admitranking/services/fetch-rankings.js";

describe("fetchAdmitRankingShow", () => {
  it("returns ranking metadata and a lightweight ranked school list", async () => {
    const provider = {
      listRankings: async () => [
        {
          id: "52",
          title: "Best Public Intl Departments",
          year: 2026
        }
      ],
      listRankingEntries: async (rankId: string, page: number, size: number) => [
        {
          schoolId: "105",
          rank: 3,
          schoolName: "Third School",
          schoolNameEn: "Third School EN",
          region: {
            country: "中国",
            province: "上海市",
            city: "上海市"
          }
        },
        {
          schoolId: "103",
          rank: 1,
          schoolName: "Test School",
          schoolNameEn: "Test School EN",
          region: {
            country: "中国",
            province: "上海市",
            city: "上海市"
          }
        },
        {
          schoolId: "104",
          rank: 2,
          schoolName: "Second School",
          schoolNameEn: "Second School EN",
          region: {
            country: "中国",
            province: "上海市",
            city: "上海市"
          }
        }
      ]
    };

    const result = await fetchAdmitRankingShow("52", { page: 2, size: 10 }, provider);

    expect(result).toEqual({
      ranking: {
        id: "52",
        title: "Best Public Intl Departments",
        year: 2026
      },
      schools: [
        {
          schoolId: "103",
          rank: 1,
          schoolName: "Test School",
          schoolNameEn: "Test School EN",
          region: {
            country: "中国",
            province: "上海市",
            city: "上海市"
          }
        },
        {
          schoolId: "104",
          rank: 2,
          schoolName: "Second School",
          schoolNameEn: "Second School EN",
          region: {
            country: "中国",
            province: "上海市",
            city: "上海市"
          }
        },
        {
          schoolId: "105",
          rank: 3,
          schoolName: "Third School",
          schoolNameEn: "Third School EN",
          region: {
            country: "中国",
            province: "上海市",
            city: "上海市"
          }
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
