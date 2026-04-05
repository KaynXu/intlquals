import { describe, expect, it } from "vitest";
import { createProviderRegistry } from "../../../src/providers/registry.js";

describe("provider registry", () => {
  it("lists admitranking", () => {
    const registry = createProviderRegistry();
    expect(registry.list().map((provider) => provider.id)).toContain("admitranking");
  });
});
