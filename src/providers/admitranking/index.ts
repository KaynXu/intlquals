import { AdmitRankingClient } from "./client.js";
import { mapRankingEntry, mapRankingListItem, mapSchool } from "./mapper.js";

export class AdmitRankingProvider {
  readonly id = "admitranking";
  private readonly client = new AdmitRankingClient();

  async listRankings(page = 1, size = 20) {
    const payload = await this.client.getRankList(page, size);
    return payload.data.list.map((item: Record<string, unknown>) =>
      mapRankingListItem(item)
    );
  }

  async getRanking(rankId: string) {
    const payload = await this.client.getRankDetail(rankId);
    return mapRankingListItem(payload.data);
  }

  async listRankingEntries(rankId: string, page = 1, size = 20) {
    const payload = await this.client.getRankEntries(rankId, page, size);
    return payload.data.list.map((item: Record<string, unknown>) =>
      mapRankingEntry(item, rankId)
    );
  }

  async getSchool(comId: string) {
    const payload = await this.client.getSchool(comId);
    return mapSchool(payload.data);
  }
}
