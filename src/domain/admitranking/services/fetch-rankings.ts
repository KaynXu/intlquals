import { AdmitRankingProvider } from "../../../providers/admitranking/index.js";
import type {
  Ranking,
  RankingCatalog,
  RankingCatalogByYears,
  RankingEntry
} from "../models/ranking.js";

const provider = new AdmitRankingProvider();

export interface RankingProvider {
  listRankings(page?: number, size?: number): Promise<Ranking[]>;
  listHistoricalRankings(): Promise<Ranking[]>;
}

export interface AdmitRankingShowProvider {
  listRankings(page?: number, size?: number): Promise<Ranking[]>;
  listRankingEntries(rankId: string, page?: number, size?: number): Promise<RankingEntry[]>;
}

export function formatRankingList(rankings: Ranking[]): RankingCatalog {
  const yearSet = new Set(rankings.map((item) => item.year).filter((item) => item !== undefined));

  if (yearSet.size === 1) {
    const [year] = yearSet;

    return {
      year,
      rankings: rankings.map(({ year: _year, ...item }) => item)
    };
  }

  return {
    rankings
  };
}

export function formatRankingListByYears(rankings: Ranking[]): RankingCatalogByYears {
  const grouped = new Map<number, Array<Omit<Ranking, "year">>>();

  for (const ranking of rankings) {
    if (ranking.year === undefined) {
      continue;
    }

    const current = grouped.get(ranking.year) ?? [];
    current.push({
      id: ranking.id,
      title: ranking.title,
      titleEn: ranking.titleEn
    });
    grouped.set(ranking.year, current);
  }

  return {
    years: [...grouped.entries()]
      .sort((left, right) => right[0] - left[0])
      .map(([year, entries]) => ({
        year,
        rankings: entries
      }))
  };
}

function mergeRankings(current: Ranking[], historical: Ranking[]) {
  const merged = new Map<string, Ranking>();

  for (const ranking of [...current, ...historical]) {
    if (!merged.has(ranking.id)) {
      merged.set(ranking.id, ranking);
    }
  }

  return [...merged.values()];
}

export async function fetchRankingList(
  options: { page?: number; size?: number; year?: number; allYears?: boolean } = {},
  currentProvider: RankingProvider = provider
) {
  const page = options.page ?? 1;
  const size = options.size ?? 20;

  if (options.year !== undefined || options.allYears) {
    const [currentRankings, historicalRankings] = await Promise.all([
      currentProvider.listRankings(page, size),
      currentProvider.listHistoricalRankings()
    ]);
    const merged = mergeRankings(currentRankings, historicalRankings);

    if (options.allYears) {
      return formatRankingListByYears(merged);
    }

    const yearRankings = merged.filter((ranking) => ranking.year === options.year);

    if (yearRankings.length === 0 && options.year !== undefined) {
      return {
        year: options.year,
        rankings: []
      };
    }

    return formatRankingList(yearRankings);
  }

  return formatRankingList(await currentProvider.listRankings(page, size));
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
    schools: [...schools].sort((left, right) => left.rank - right.rank),
    page,
    size
  };
}
