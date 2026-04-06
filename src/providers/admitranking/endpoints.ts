export const ADMITRANKING_BASE_URL = "https://admitranking.com";

export function buildRankListUrl(page = 1, size = 20): string {
  return `${ADMITRANKING_BASE_URL}/mb/api/intl/rank/getRankByType?rankType=1&pn=${page}&size=${size}`;
}

export function buildRankDetailUrl(rankId: string): string {
  return `${ADMITRANKING_BASE_URL}/mb/api/intl/rank/getRankDetail?rankId=${rankId}`;
}

export function buildRankEntriesUrl(): string {
  return `${ADMITRANKING_BASE_URL}/mb/api/intl/school/getComPageRankEnV2`;
}
