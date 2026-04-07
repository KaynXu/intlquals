import { afterEach, describe, expect, it, vi } from "vitest";

const { fetchSchoolSectionMock } = vi.hoisted(() => ({
  fetchSchoolSectionMock: vi.fn(async (schoolId: string, section: string) => ({
    schoolId,
    section,
    data: {
      ok: true
    }
  }))
}));

vi.mock("../../../src/domain/admitranking/services/fetch-schools.js", () => ({
  availableSchoolSections: ["overview", "apply", "contact", "media", "signals"],
  fetchSchoolSection: fetchSchoolSectionMock
}));

import { buildRankCommand } from "../../../src/cli/commands/rank.js";

describe("rank school command", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    fetchSchoolSectionMock.mockClear();
  });

  it("shows available sections in help output", () => {
    const command = buildRankCommand();
    const admitranking = command.commands.find((subcommand) => subcommand.name() === "admitranking");
    const school = admitranking?.commands.find((subcommand) => subcommand.name() === "school");
    const writeSpy = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    school?.outputHelp();

    const helpText = writeSpy.mock.calls.map((call) => String(call[0])).join("");
    expect(helpText).toContain("Available sections:");
    expect(helpText).toContain("overview");
    expect(helpText).toContain("apply");
    expect(helpText).toContain("contact");
    expect(helpText).toContain("media");
    expect(helpText).toContain("signals");
  });

  it("prints a requested school section when a section is provided", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const command = buildRankCommand();

    await command.parseAsync(["node", "rank", "admitranking", "school", "12523", "apply"]);

    expect(fetchSchoolSectionMock).toHaveBeenCalledWith("12523", "apply");
    expect(logSpy).toHaveBeenCalledWith(
      JSON.stringify(
        {
          schoolId: "12523",
          section: "apply",
          data: {
            ok: true
          }
        },
        null,
        2
      )
    );
  });

  it("requires a school id instead of treating bare school as a section browser", async () => {
    const command = buildRankCommand();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await expect(
      command.parseAsync(["node", "rank", "admitranking", "school"])
    ).rejects.toThrow('process.exit unexpectedly called with "1"');

    expect(fetchSchoolSectionMock).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });
});
