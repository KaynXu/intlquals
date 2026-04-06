import type { SourceRecord } from "./source.js";

export interface Ranking {
  id: string;
  provider: string;
  title: string;
  titleEn?: string;
  year?: number;
  scope?: string;
  region?: string;
  description?: string;
  methodology?: string;
  sourceRef?: SourceRecord;
}

export interface RankingEntry {
  rankingId: string;
  entityId: string;
  rank: number;
  score?: number;
  labels: string[];
  snapshotId?: string;
}
