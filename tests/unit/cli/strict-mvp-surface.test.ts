import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(import.meta.dirname, "../../..");

describe("strict MVP surface", () => {
  it("removes code paths that are outside the current rank-only MVP", () => {
    const removedPaths = [
      "src/core/config.ts",
      "src/core/errors.ts",
      "src/core/logger.ts",
      "src/core/result.ts",
      "src/domain/models/export-task.ts",
      "src/domain/models/snapshot.ts",
      "src/domain/models/source.ts",
      "src/domain/services/compare-schools.ts",
      "src/domain/services/export-data.ts",
      "src/infra/cache/keys.ts",
      "src/infra/cache/sqlite.ts",
      "src/infra/http/client.ts",
      "src/infra/http/retry.ts",
      "src/infra/http/throttle.ts",
      "src/infra/serializers/csv.ts",
      "src/infra/serializers/json.ts",
      "src/infra/serializers/markdown.ts",
      "src/providers/registry.ts",
      "src/providers/types.ts",
      "src/providers/admitranking/signer.ts"
    ];

    expect(
      removedPaths.filter((relativePath) => existsSync(path.join(rootDir, relativePath)))
    ).toEqual([]);
  });

  it("removes the unused school search path from the current MVP", () => {
    const fetchSchoolsSource = readFileSync(
      path.join(rootDir, "src/domain/admitranking/services/fetch-schools.ts"),
      "utf8"
    );
    const providerSource = readFileSync(
      path.join(rootDir, "src/providers/admitranking/index.ts"),
      "utf8"
    );
    const clientSource = readFileSync(
      path.join(rootDir, "src/providers/admitranking/client.ts"),
      "utf8"
    );

    expect(fetchSchoolsSource.includes("searchSchools")).toBe(false);
    expect(providerSource.includes("searchSchools")).toBe(false);
    expect(clientSource.includes("searchSchools")).toBe(false);
  });

  it("uses a provider-specific domain layout instead of shared domain files", () => {
    const removedSharedDomainPaths = [
      "src/domain/models/ranking.ts",
      "src/domain/models/school.ts",
      "src/domain/services/fetch-rankings.ts",
      "src/domain/services/fetch-schools.ts"
    ];
    const requiredProviderDomainPaths = [
      "src/domain/admitranking/models/ranking.ts",
      "src/domain/admitranking/models/school.ts",
      "src/domain/admitranking/services/fetch-rankings.ts",
      "src/domain/admitranking/services/fetch-schools.ts"
    ];

    expect(
      removedSharedDomainPaths.filter((relativePath) =>
        existsSync(path.join(rootDir, relativePath))
      )
    ).toEqual([]);
    expect(
      requiredProviderDomainPaths.filter((relativePath) =>
        existsSync(path.join(rootDir, relativePath))
      )
    ).toEqual(requiredProviderDomainPaths);
  });
});
