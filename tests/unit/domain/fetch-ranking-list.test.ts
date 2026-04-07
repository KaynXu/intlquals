import { describe, expect, it } from "vitest";
import {
  fetchRankingList,
  formatRankingList,
  formatRankingListByYears
} from "../../../src/domain/admitranking/services/fetch-rankings.js";

describe("formatRankingList", () => {
  it("lifts a shared year to the top-level ranking catalog", () => {
    const result = formatRankingList([
      {
        id: "52",
        title: "翠鹿最佳公立国际部排名",
        titleEn: "Cuilu Best Public Intl Departments",
        year: 2026
      },
      {
        id: "61",
        title: "翠鹿中国国际化学校竞争力排名",
        titleEn: "Cui Lu China International School Admit Ranking!",
        year: 2026
      }
    ]);

    expect(result).toEqual({
      year: 2026,
      rankings: [
        {
          id: "52",
          title: "翠鹿最佳公立国际部排名",
          titleEn: "Cuilu Best Public Intl Departments"
        },
        {
          id: "61",
          title: "翠鹿中国国际化学校竞争力排名",
          titleEn: "Cui Lu China International School Admit Ranking!"
        }
      ]
    });
  });

  it("keeps year on each ranking when multiple years are present", () => {
    const result = formatRankingList([
      {
        id: "52",
        title: "翠鹿最佳公立国际部排名",
        year: 2026
      },
      {
        id: "40",
        title: "往年榜单",
        year: 2025
      }
    ]);

    expect(result).toEqual({
      rankings: [
        {
          id: "52",
          title: "翠鹿最佳公立国际部排名",
          year: 2026
        },
        {
          id: "40",
          title: "往年榜单",
          year: 2025
        }
      ]
    });
  });

  it("groups rankings by year for all-year output", () => {
    const result = formatRankingListByYears([
      {
        id: "61",
        title: "翠鹿中国国际化学校竞争力排名",
        year: 2026
      },
      {
        id: "56",
        title: "翠鹿中国国际学校竞争力榜",
        year: 2025
      },
      {
        id: "52",
        title: "翠鹿最佳公立国际部排名",
        year: 2026
      }
    ]);

    expect(result).toEqual({
      years: [
        {
          year: 2026,
          rankings: [
            {
              id: "61",
              title: "翠鹿中国国际化学校竞争力排名"
            },
            {
              id: "52",
              title: "翠鹿最佳公立国际部排名"
            }
          ]
        },
        {
          year: 2025,
          rankings: [
            {
              id: "56",
              title: "翠鹿中国国际学校竞争力榜"
            }
          ]
        }
      ]
    });
  });

  it("returns a requested historical year from discovered rankings", async () => {
    const provider = {
      listRankings: async () => [
        {
          id: "61",
          title: "翠鹿中国国际化学校竞争力排名",
          year: 2026
        }
      ],
      listHistoricalRankings: async () => [
        {
          id: "61",
          title: "翠鹿中国国际化学校竞争力排名",
          year: 2026
        },
        {
          id: "56",
          title: "翠鹿中国国际学校竞争力榜",
          year: 2025
        }
      ]
    };

    await expect(fetchRankingList({ year: 2025 }, provider)).resolves.toEqual({
      year: 2025,
      rankings: [
        {
          id: "56",
          title: "翠鹿中国国际学校竞争力榜"
        }
      ]
    });
  });

  it("returns all discovered years when all-years is requested", async () => {
    const provider = {
      listRankings: async () => [
        {
          id: "61",
          title: "翠鹿中国国际化学校竞争力排名",
          year: 2026
        }
      ],
      listHistoricalRankings: async () => [
        {
          id: "61",
          title: "翠鹿中国国际化学校竞争力排名",
          year: 2026
        },
        {
          id: "56",
          title: "翠鹿中国国际学校竞争力榜",
          year: 2025
        }
      ]
    };

    await expect(fetchRankingList({ allYears: true }, provider)).resolves.toEqual({
      years: [
        {
          year: 2026,
          rankings: [
            {
              id: "61",
              title: "翠鹿中国国际化学校竞争力排名"
            }
          ]
        },
        {
          year: 2025,
          rankings: [
            {
              id: "56",
              title: "翠鹿中国国际学校竞争力榜"
            }
          ]
        }
      ]
    });
  });
});
