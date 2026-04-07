import { AdmitRankingProvider } from "../../../providers/admitranking/index.js";
import type {
  SchoolSectionName,
  SchoolSectionResult
} from "../models/school.js";

const provider = new AdmitRankingProvider();

export const availableSchoolSections: SchoolSectionName[] = [
  "overview",
  "apply",
  "contact",
  "media",
  "signals"
];

export interface SchoolSectionProvider {
  getSchoolSection(
    schoolId: string,
    section: SchoolSectionName
  ): Promise<SchoolSectionResult>;
}

export async function fetchSchoolSection(
  schoolId: string,
  section: SchoolSectionName = "overview",
  currentProvider: SchoolSectionProvider = provider
) {
  return currentProvider.getSchoolSection(schoolId, section);
}
