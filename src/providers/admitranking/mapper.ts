import type { Ranking, RankingEntry } from "../../domain/models/ranking.js";
import type { School } from "../../domain/models/school.js";
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

export function mapSchool(input: Record<string, unknown>): School {
  const labelList = Array.isArray(input.curriculumLabels)
    ? input.curriculumLabels.map((item) => String(item))
    : Array.isArray(input.lableList)
      ? input.lableList
          .filter(
            (item): item is Record<string, unknown> =>
              typeof item === "object" && item !== null && "title" in item
          )
          .map((item) => String(item.title))
      : [];

  const curriculumSystem =
    typeof input.extendAttr === "object" &&
    input.extendAttr !== null &&
    "curriculumSystem" in input.extendAttr &&
    typeof input.extendAttr.curriculumSystem === "string"
      ? input.extendAttr.curriculumSystem
          .split(/[，,]/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const curricula = Array.from(
    new Set(
      [...labelList, ...curriculumSystem].filter((item) =>
        ["AP", "IB", "ALevel", "A-Level", "IGCSE", "OSSD", "美高课程", "艺术课程"].includes(
          item
        )
      )
    )
  );

  return {
    id: String(input.id),
    provider: "admitranking",
    name: String(input.title ?? input.name ?? ""),
    nameEn: input.titleEn ? String(input.titleEn) : undefined,
    country: input.countryName ? String(input.countryName) : undefined,
    province: input.provinceName ? String(input.provinceName) : undefined,
    city: input.cityName ? String(input.cityName) : undefined,
    schoolType: input.typeTitle ? String(input.typeTitle) : undefined,
    curricula,
    gradeRange:
      typeof input.gradeStart === "number" && typeof input.gradeEnd === "number"
        ? `${input.gradeStart}-${input.gradeEnd}`
        : undefined,
    tags:
      typeof input.labels === "string"
        ? String(input.labels).split(",").filter(Boolean)
        : labelList,
    stats: {
      rank: input.rank,
      judgeCount: input.judgeCount,
      transparency: input.dataTransparencyInt
    }
  };
}
