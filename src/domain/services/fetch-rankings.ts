import { AdmitRankingProvider } from "../../providers/admitranking/index.js";

const provider = new AdmitRankingProvider();

export async function fetchRankingList(page = 1, size = 20) {
  return provider.listRankings(page, size);
}

export async function fetchRanking(rankId: string) {
  return provider.getRanking(rankId);
}

export async function fetchRankingEntries(
  rankId: string,
  page = 1,
  size = 20
) {
  return provider.listRankingEntries(rankId, page, size);
}
