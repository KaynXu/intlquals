import { AdmitRankingClient } from "./client.js";
import { mapRankingEntry, mapRankingListItem, mapSchoolSection } from "./mapper.js";
import type { Ranking } from "../../domain/admitranking/models/ranking.js";
import type { SchoolSectionName } from "../../domain/admitranking/models/school.js";

export class AdmitRankingProvider {
  readonly id = "admitranking";
  private readonly client = new AdmitRankingClient();

  async listRankings(page = 1, size = 20) {
    const payload = await this.client.getRankList(page, size);
    return payload.data.list.map((item: Record<string, unknown>) =>
      mapRankingListItem(item)
    );
  }

  async listRankingEntries(rankId: string, page = 1, size = 20) {
    const payload = await this.client.getRankEntries(rankId, page, size);
    return payload.data.list.map((item: Record<string, unknown>) =>
      mapRankingEntry(item, rankId)
    );
  }

  async listHistoricalRankings() {
    const currentRankings = await this.listRankings(1, 100);
    const maxPublicRankId = currentRankings.reduce((max: number, item: Ranking) => {
      const value = Number(item.id);
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0);
    const scanUpperBound = Math.max(120, maxPublicRankId + 20);
    const discovered = await this.scanRankDetails(scanUpperBound);

    return this.dedupeRankings(
      discovered
        .filter((item): item is Ranking => item !== null)
        .filter((item) => this.isPublicHistoricalRanking(item))
    );
  }

  async getSchoolSection(comId: string, section: SchoolSectionName) {
    const payload = await this.client.getSchool(comId);
    return mapSchoolSection(payload.data, comId, section);
  }

  private async scanRankDetails(maxRankId: number) {
    const ids = Array.from({ length: maxRankId }, (_, index) => String(index + 1));
    const batchSize = 12;
    const results: Array<Ranking | null> = [];

    for (let index = 0; index < ids.length; index += batchSize) {
      const batch = ids.slice(index, index + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (rankId) => {
          try {
            const payload = await this.client.getRankDetail(rankId);

            if (payload?.code !== 200 || !payload?.data || typeof payload.data !== "object") {
              return null;
            }

            return mapRankingListItem(payload.data as Record<string, unknown>);
          } catch {
            return null;
          }
        })
      );

      results.push(...batchResults);
    }

    return results;
  }

  private dedupeRankings(rankings: Ranking[]) {
    const seen = new Set<string>();
    const deduped: Ranking[] = [];

    for (const ranking of rankings) {
      if (seen.has(ranking.id)) {
        continue;
      }

      seen.add(ranking.id);
      deduped.push(ranking);
    }

    return deduped.sort((left, right) => {
      const leftYear = left.year ?? 0;
      const rightYear = right.year ?? 0;

      if (leftYear !== rightYear) {
        return rightYear - leftYear;
      }

      return Number(left.id) - Number(right.id);
    });
  }

  private isPublicHistoricalRanking(ranking: Ranking) {
    const title = ranking.title;
    const excludedPatterns = [/不对外/, /已停用/, /数据库/, /内部/];

    return !excludedPatterns.some((pattern) => pattern.test(title));
  }
}
