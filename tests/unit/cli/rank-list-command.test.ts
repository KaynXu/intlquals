import { afterEach, describe, expect, it, vi } from "vitest";

const { fetchRankingListMock } = vi.hoisted(() => ({
  fetchRankingListMock: vi.fn(async () => ({
    year: 2026,
    rankings: []
  }))
}));

vi.mock("../../../src/domain/admitranking/services/fetch-rankings.js", async () => {
  const actual = await vi.importActual<
    typeof import("../../../src/domain/admitranking/services/fetch-rankings.js")
  >("../../../src/domain/admitranking/services/fetch-rankings.js");

  return {
    ...actual,
    fetchRankingList: fetchRankingListMock
  };
});

import { buildRankCommand } from "../../../src/cli/commands/rank.js";

describe("rank list command", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    fetchRankingListMock.mockClear();
  });

  it("passes year to ranking list fetch when --year is provided", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const command = buildRankCommand();

    await command.parseAsync(["node", "rank", "admitranking", "list", "--year", "2025"]);

    expect(fetchRankingListMock).toHaveBeenCalledWith({ year: 2025 });
    expect(logSpy).toHaveBeenCalled();
  });

  it("requests all years when --all-years is provided", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const command = buildRankCommand();

    await command.parseAsync(["node", "rank", "admitranking", "list", "--all-years"]);

    expect(fetchRankingListMock).toHaveBeenCalledWith({ allYears: true });
    expect(logSpy).toHaveBeenCalled();
  });
});
