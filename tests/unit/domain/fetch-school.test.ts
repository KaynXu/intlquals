import { describe, expect, it } from "vitest";
import {
  availableSchoolSections,
  fetchSchoolSection
} from "../../../src/domain/admitranking/services/fetch-schools.js";
import type { SchoolSectionName } from "../../../src/domain/admitranking/models/school.js";

describe("school sections", () => {
  it("keeps the available school detail sections in one shared list", () => {
    expect(availableSchoolSections).toEqual([
      "overview",
      "apply",
      "contact",
      "media",
      "signals"
    ]);
  });

  it("returns the requested school overview section", async () => {
    const provider = {
      getSchoolSection: async (schoolId: string, section: SchoolSectionName) => ({
        schoolId,
        section,
        data: {
          id: schoolId,
          name: "Test School"
        }
      })
    };

    await expect(fetchSchoolSection("12523", "overview", provider)).resolves.toEqual({
      schoolId: "12523",
      section: "overview",
      data: {
        id: "12523",
        name: "Test School"
      }
    });
  });
});
