import type { SourceRecord } from "./source.js";

export interface School {
  id: string;
  provider: string;
  name: string;
  nameEn?: string;
  country?: string;
  province?: string;
  city?: string;
  schoolType?: string;
  curricula: string[];
  gradeRange?: string;
  tags: string[];
  stats: Record<string, unknown>;
  sourceRef?: SourceRecord;
}
