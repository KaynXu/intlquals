import { describe, expect, it } from "vitest";
import {
  mapRankingEntry,
  mapRankingListItem,
  mapSchool,
  mapSchoolSection
} from "../../../../src/providers/admitranking/mapper.js";

describe("admitranking mapper", () => {
  it("maps a ranking list item without repeating provider metadata", () => {
    const ranking = mapRankingListItem({
      id: 52,
      title: "翠鹿最佳公立国际部排名",
      etitle: "Cuilu Best Public Intl Departments",
      year: 2026
    });

    expect(ranking.id).toBe("52");
    expect(ranking.titleEn).toBe("Cuilu Best Public Intl Departments");
    expect("provider" in ranking).toBe(false);
  });

  it("maps a school detail without repeating provider metadata", () => {
    const school = mapSchool({
      id: 12523,
      title: "深圳外国语学校高中部国际书院(盐田)",
      titleEn: "Shenzhen Foreign Language School(Group)-Academy of International Programs",
      countryName: "中国",
      provinceName: "广东省",
      cityName: "深圳市",
      typeTitle: "K12学校:10至12年级",
      gradeStart: 10,
      gradeEnd: 12,
      curriculumLabels: ["AP", "ALevel"],
      labels: "高中,公立国际部,AP,ALevel",
      judgeCount: 3,
      dataTransparencyInt: 5,
      rank: 24
    });

    expect(school.id).toBe("12523");
    expect(school.name).toBe("深圳外国语学校高中部国际书院(盐田)");
    expect(school.curricula).toEqual(["AP", "ALevel"]);
    expect("provider" in school).toBe(false);
  });

  it("maps a ranking entry into a lightweight ranked school row", () => {
    const entry = mapRankingEntry(
      {
        id: 12523,
        rank: 24,
        title: "深圳外国语学校高中部国际书院(盐田)",
        titleEn: "Shenzhen Foreign Language School(Group)-Academy of International Programs",
        countryName: "中国",
        provinceName: "广东省",
        cityName: "深圳市"
      },
      "52"
    );

    expect(entry).toEqual({
      schoolId: "12523",
      rank: 24,
      schoolName: "深圳外国语学校高中部国际书院(盐田)",
      schoolNameEn: "Shenzhen Foreign Language School(Group)-Academy of International Programs",
      region: {
        country: "中国",
        province: "广东省",
        city: "深圳市"
      }
    });
  });

  it("maps a school apply section into a focused payload", () => {
    const section = mapSchoolSection(
      {
        id: 12523,
        title: "深圳外国语学校高中部国际书院(盐田)",
        apply: {
          tuitionDesc: "学费每学年8万",
          tuitionRange: "8万",
          enrollmentRequirement: "国内学籍",
          hasExamination: 0,
          hasInterview: 0
        }
      },
      "12523",
      "apply"
    );

    expect(section).toEqual({
      schoolId: "12523",
      section: "apply",
      data: {
        schoolId: "12523",
        schoolName: "深圳外国语学校高中部国际书院(盐田)",
        tuition: "学费每学年8万",
        tuitionRange: "8万",
        enrollmentRequirement: "国内学籍",
        hasExamination: false,
        hasInterview: false
      }
    });
  });
});
