export interface Ranking {
  id: string;
  provider: string;
  title: string;
  titleEn?: string;
  year?: number;
}

export interface RankingEntry {
  rankingId: string;
  entityId: string;
  rank: number;
  labels: string[];
}
