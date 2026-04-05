import { describe, expect, it } from "vitest";
import { resolveConfig } from "../../../src/core/config.js";

describe("resolveConfig", () => {
  it("uses IQ_DATA_DIR when present", () => {
    const config = resolveConfig({ IQ_DATA_DIR: "/tmp/iq-data" });
    expect(config.dataDir).toBe("/tmp/iq-data");
    expect(config.cacheDbPath).toBe("/tmp/iq-data/cache.sqlite");
  });
});
