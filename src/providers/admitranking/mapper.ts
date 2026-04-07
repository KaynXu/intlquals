import type { Ranking, RankingEntry } from "../../domain/admitranking/models/ranking.js";
import type {
  SchoolApplySection,
  SchoolContactSection,
  SchoolMediaItem,
  SchoolMediaSection,
  SchoolOverview,
  SchoolSectionName,
  SchoolSectionResult,
  SchoolSignalsSection
} from "../../domain/admitranking/models/school.js";
import { admitRankingEntrySchema, admitRankingListItemSchema } from "./schemas.js";

export function mapRankingListItem(input: Record<string, unknown>): Ranking {
  const item = admitRankingListItemSchema.parse(input);

  return {
    id: String(item.id),
    title: item.title,
    titleEn: item.etitle,
    year: item.year
  };
}

export function mapRankingEntry(
  input: Record<string, unknown>,
  _rankingId: string
): RankingEntry {
  const item = admitRankingEntrySchema.parse(input);

  return {
    schoolId: String(item.id),
    rank: item.rank ?? 0,
    schoolName: item.title ?? "",
    schoolNameEn: item.titleEn,
    region: {
      country: item.countryName,
      province: item.provinceName,
      city: item.cityName
    }
  };
}

export function mapSchool(input: Record<string, unknown>): SchoolOverview {
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
    name: String(input.title ?? input.name ?? ""),
    nameEn: input.titleEn ? String(input.titleEn) : undefined,
    region: {
      country: input.countryName ? String(input.countryName) : undefined,
      province: input.provinceName ? String(input.provinceName) : undefined,
      city: input.cityName ? String(input.cityName) : undefined
    },
    schoolType: input.typeTitle ? String(input.typeTitle) : undefined,
    curricula,
    gradeRange:
      typeof input.gradeStart === "number" && typeof input.gradeEnd === "number"
        ? `${input.gradeStart}-${input.gradeEnd}`
        : undefined,
    tags:
      typeof input.labels === "string"
        ? String(input.labels).split(",").filter(Boolean)
        : labelList
  };
}

function mapSchoolApplySection(input: Record<string, unknown>): SchoolApplySection {
  const apply =
    typeof input.apply === "object" && input.apply !== null
      ? (input.apply as Record<string, unknown>)
      : {};

  return {
    schoolId: String(input.id),
    schoolName: String(input.title ?? input.name ?? ""),
    tuition: typeof apply.tuitionDesc === "string" ? apply.tuitionDesc : undefined,
    tuitionRange: typeof apply.tuitionRange === "string" ? apply.tuitionRange : undefined,
    enrollmentRequirement:
      typeof apply.enrollmentRequirement === "string"
        ? apply.enrollmentRequirement
        : undefined,
    hasExamination:
      typeof apply.hasExamination === "number"
        ? apply.hasExamination > 0
        : undefined,
    hasInterview:
      typeof apply.hasInterview === "number" ? apply.hasInterview > 0 : undefined
  };
}

function mapSchoolContactSection(input: Record<string, unknown>): SchoolContactSection {
  return {
    schoolId: String(input.id),
    schoolName: String(input.title ?? input.name ?? ""),
    website: typeof input.website === "string" ? input.website : undefined,
    email: typeof input.email === "string" ? input.email : undefined,
    phone: typeof input.telPhone === "string" ? input.telPhone : undefined,
    address: typeof input.address === "string" ? input.address : undefined,
    wechat: typeof input.wechatAcount === "string" ? input.wechatAcount : undefined
  };
}

function mapSchoolMediaSection(input: Record<string, unknown>): SchoolMediaSection {
  const medias = Array.isArray(input.medias)
    ? input.medias
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
        .map(
          (item): SchoolMediaItem => ({
            id: String(item.id ?? ""),
            type: item.type === 2 ? "video" : "image",
            srcPath: String(item.srcPath ?? ""),
            placeholder:
              typeof item.pleaceholder === "string" ? item.pleaceholder : undefined
          })
        )
    : [];

  return {
    schoolId: String(input.id),
    schoolName: String(input.title ?? input.name ?? ""),
    items: medias
  };
}

function mapSchoolSignalsSection(input: Record<string, unknown>): SchoolSignalsSection {
  const extendAttr =
    typeof input.extendAttr === "object" && input.extendAttr !== null
      ? (input.extendAttr as Record<string, unknown>)
      : {};

  return {
    schoolId: String(input.id),
    schoolName: String(input.title ?? input.name ?? ""),
    judgeCount: typeof input.judgeCount === "number" ? input.judgeCount : undefined,
    transparency:
      typeof input.dataTransparencyInt === "number"
        ? input.dataTransparencyInt
        : typeof extendAttr.dataTransparencyInt === "number"
          ? extendAttr.dataTransparencyInt
          : undefined,
    academicResources:
      typeof extendAttr.dataAcademicRes === "number" ? extendAttr.dataAcademicRes : undefined,
    schoolHonors:
      typeof extendAttr.dataSchoolHonors === "number" ? extendAttr.dataSchoolHonors : undefined,
    admissionOutcomes:
      typeof extendAttr.dataUpResult === "number" ? extendAttr.dataUpResult : undefined
  };
}

export function mapSchoolSection(
  input: Record<string, unknown>,
  schoolId: string,
  section: SchoolSectionName
): SchoolSectionResult {
  const normalizedInput =
    String(input.id ?? "") === schoolId ? input : { ...input, id: schoolId };

  const data =
    section === "overview"
      ? mapSchool(normalizedInput)
      : section === "apply"
        ? mapSchoolApplySection(normalizedInput)
        : section === "contact"
          ? mapSchoolContactSection(normalizedInput)
          : section === "media"
            ? mapSchoolMediaSection(normalizedInput)
            : mapSchoolSignalsSection(normalizedInput);

  return {
    schoolId,
    section,
    data
  };
}
