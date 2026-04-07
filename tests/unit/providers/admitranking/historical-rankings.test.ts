import { describe, expect, it } from "vitest";
import { AdmitRankingProvider } from "../../../../src/providers/admitranking/index.js";

describe("AdmitRankingProvider historical rankings", () => {
  it("keeps public historical rankings even when they are not intl-school specific", async () => {
    const provider: any = new AdmitRankingProvider();

    provider.listRankings = async () => [
      {
        id: "61",
        title: "翠鹿中国国际化学校竞争力排名",
        year: 2026
      }
    ];
    provider.scanRankDetails = async () => [
      {
        id: "21",
        title: "QS全球大学排名",
        year: 2025
      },
      {
        id: "22",
        title: "U.S.News 美国大学排名",
        year: 2025
      },
      {
        id: "45",
        title: "数据库不对外",
        year: 2025
      },
      {
        id: "44",
        title: "【已停用】不对外",
        year: 2025
      },
      {
        id: "61",
        title: "翠鹿中国国际化学校竞争力排名",
        year: 2026
      }
    ];

    await expect(provider.listHistoricalRankings()).resolves.toEqual([
      {
        id: "61",
        title: "翠鹿中国国际化学校竞争力排名",
        year: 2026
      },
      {
        id: "21",
        title: "QS全球大学排名",
        year: 2025
      },
      {
        id: "22",
        title: "U.S.News 美国大学排名",
        year: 2025
      }
    ]);
  });
});
