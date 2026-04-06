import { AdmitRankingProvider } from "../../../providers/admitranking/index.js";
import type { Ranking, RankingEntry } from "../models/ranking.js";

const provider = new AdmitRankingProvider();

export interface RankingProvider {
  listRankings(page?: number, size?: number): Promise<Ranking[]>;
  getRanking(rankId: string): Promise<Ranking>;
  listRankingEntries(rankId: string, page?: number, size?: number): Promise<RankingEntry[]>;
}

export interface AdmitRankingShowProvider {
  getRanking(rankId: string): Promise<Ranking>;
  listRankingEntries(rankId: string, page?: number, size?: number): Promise<RankingEntry[]>;
}

export async function fetchRankingList(page = 1, size = 20) {
  return provider.listRankings(page, size);
}

export async function fetchRanking(rankId: string) {
  return provider.getRanking(rankId);
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
  const [ranking, schools] = await Promise.all([
    currentProvider.getRanking(rankId),
    currentProvider.listRankingEntries(rankId, page, size)
  ]);

  return {
    ranking,
    schools,
    page,
    size
  };
}
