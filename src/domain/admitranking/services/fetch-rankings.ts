import { AdmitRankingProvider } from "../../../providers/admitranking/index.js";
import type { Ranking, RankingEntry } from "../models/ranking.js";

const provider = new AdmitRankingProvider();

export interface RankingProvider {
  listRankings(page?: number, size?: number): Promise<Ranking[]>;
  listRankingEntries(rankId: string, page?: number, size?: number): Promise<RankingEntry[]>;
}

export interface AdmitRankingShowProvider {
  listRankings(page?: number, size?: number): Promise<Ranking[]>;
  listRankingEntries(rankId: string, page?: number, size?: number): Promise<RankingEntry[]>;
}

export async function fetchRankingList(page = 1, size = 20) {
  return provider.listRankings(page, size);
}

export async function fetchRankingEntries(rankId: string, page = 1, size = 20) {
  return provider.listRankingEntries(rankId, page, size);
}

export async function fetchAdmitRankingShow(
  rankId: string,
  options: { page?: number; size?: number } = {},
  currentProvider: AdmitRankingShowProvider = provider
) {
  const page = options.page ?? 1;
  const size = options.size ?? 20;
  const [rankings, schools] = await Promise.all([
    currentProvider.listRankings(),
    currentProvider.listRankingEntries(rankId, page, size)
  ]);
  const ranking = rankings.find((item) => item.id === rankId);

  if (!ranking) {
    throw new Error(`Ranking not found: ${rankId}`);
  }

  return {
    ranking,
    schools,
    page,
    size
  };
}
