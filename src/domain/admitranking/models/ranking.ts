export interface Ranking {
  id: string;
  title: string;
  titleEn?: string;
  year?: number;
}

export interface RankingCatalog {
  year?: number;
  rankings: Ranking[];
}

export interface RankingCatalogByYears {
  years: Array<{
    year: number;
    rankings: Array<Omit<Ranking, "year">>;
  }>;
}

export interface RankingEntry {
  schoolId: string;
  rank: number;
  schoolName: string;
  schoolNameEn?: string;
  region: {
    country?: string;
    province?: string;
    city?: string;
  };
}
