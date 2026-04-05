import type { Ranking, RankingEntry } from "../../domain/models/ranking.js";
import { admitRankingEntrySchema, admitRankingListItemSchema } from "./schemas.js";

export function mapRankingListItem(input: Record<string, unknown>): Ranking {
  const item = admitRankingListItemSchema.parse(input);

  return {
    id: String(item.id),
    provider: "admitranking",
    title: item.title,
    titleEn: item.etitle,
    year: item.year
  };
}

export function mapRankingEntry(
  input: Record<string, unknown>,
  rankingId: string
): RankingEntry {
  const item = admitRankingEntrySchema.parse(input);

  return {
    rankingId,
    entityId: String(item.id),
    rank: item.rank ?? 0,
    labels: item.curriculumLabels ?? []
  };
}
