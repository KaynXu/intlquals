export interface SchoolRegion {
  country?: string;
  province?: string;
  city?: string;
}

export interface SchoolOverview {
  id: string;
  name: string;
  nameEn?: string;
  region: SchoolRegion;
  schoolType?: string;
  curricula: string[];
  gradeRange?: string;
  tags: string[];
}

export interface SchoolApplySection {
  schoolId: string;
  schoolName: string;
  tuition?: string;
  tuitionRange?: string;
  enrollmentRequirement?: string;
  hasExamination?: boolean;
  hasInterview?: boolean;
}

export interface SchoolContactSection {
  schoolId: string;
  schoolName: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  wechat?: string;
}

export interface SchoolMediaItem {
  id: string;
  type: string;
  srcPath: string;
  placeholder?: string;
}

export interface SchoolMediaSection {
  schoolId: string;
  schoolName: string;
  items: SchoolMediaItem[];
}

export interface SchoolSignalsSection {
  schoolId: string;
  schoolName: string;
  judgeCount?: number;
  transparency?: number;
  academicResources?: number;
  schoolHonors?: number;
  admissionOutcomes?: number;
}

export type SchoolSectionName =
  | "overview"
  | "apply"
  | "contact"
  | "media"
  | "signals";

export interface SchoolSectionResult<T = unknown> {
  schoolId: string;
  section: SchoolSectionName;
  data: T;
}
