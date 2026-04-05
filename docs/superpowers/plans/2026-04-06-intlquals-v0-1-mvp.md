# intlquals v0.1 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a small but credible `intlquals` CLI that can list AdmitRanking rankings, fetch ranking entries and school data, compare schools, and export normalized results to JSON, CSV, and Markdown.

**Architecture:** The CLI stays thin and delegates all business work to application services. Providers are isolated behind a registry and source-specific mapping layer, while HTTP, caching, retry, throttling, and serialization live in infrastructure modules. The first provider is AdmitRanking, accessed through its JSON API layer with a no-op signer extension point reserved for future endpoint hardening.

**Tech Stack:** Node.js 22+, TypeScript, Commander, Undici, Zod, Pino, better-sqlite3, Vitest, tsup, tsx

---

## File Structure

The implementation should create and populate this structure:

```text
src/
  cli/
    index.ts
    commands/
      root.ts
      source.ts
      rank.ts
      school.ts
      export.ts
      cache.ts
      doctor.ts
  core/
    config.ts
    errors.ts
    logger.ts
    result.ts
  providers/
    registry.ts
    types.ts
    admitranking/
      index.ts
      client.ts
      endpoints.ts
      mapper.ts
      schemas.ts
      signer.ts
  domain/
    models/
      source.ts
      ranking.ts
      school.ts
      export-task.ts
      snapshot.ts
    services/
      fetch-rankings.ts
      fetch-schools.ts
      compare-schools.ts
      export-data.ts
  infra/
    http/
      client.ts
      retry.ts
      throttle.ts
    cache/
      sqlite.ts
      keys.ts
    serializers/
      json.ts
      csv.ts
      markdown.ts
    storage/
      files.ts
tests/
  unit/
  integration/
  fixtures/
```

The implementation should stay focused on this structure instead of adding optional plugin systems, browser fallbacks, or paper ingestion code in v0.1.

### Task 1: Scaffold the TypeScript CLI project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsup.config.ts`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `src/cli/index.ts`
- Create: `src/cli/commands/root.ts`
- Create: `tests/unit/cli/smoke.test.ts`

- [ ] **Step 1: Write the failing smoke test for the root CLI**

```ts
// tests/unit/cli/smoke.test.ts
import { describe, expect, it } from "vitest";
import { buildRootCommand } from "../../../src/cli/commands/root";

describe("root command", () => {
  it("renders the product description", () => {
    const command = buildRootCommand();
    expect(command.description()).toContain("international qualifications");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/unit/cli/smoke.test.ts`
Expected: FAIL with module resolution or missing `buildRootCommand`

- [ ] **Step 3: Add package, TypeScript, and CLI scaffold**

```json
// package.json
{
  "name": "intlquals",
  "version": "0.1.0",
  "description": "Terminal-first, AI-native CLI for international qualifications research.",
  "type": "module",
  "bin": {
    "iq": "./dist/cli/index.js"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsx src/cli/index.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint:types": "tsc --noEmit"
  },
  "engines": {
    "node": ">=22"
  },
  "dependencies": {
    "commander": "^13.1.0",
    "pino": "^9.7.0"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "tsup": "^8.3.5",
    "tsx": "^4.19.3",
    "typescript": "^5.8.3",
    "vitest": "^3.1.4"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "tests", "vitest.config.ts", "tsup.config.ts"]
}
```

```ts
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli/index.ts"],
  format: ["esm"],
  target: "node22",
  clean: true,
  sourcemap: true,
  outDir: "dist",
  shims: false
});
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"]
  }
});
```

```gitignore
# .gitignore
node_modules/
dist/
.DS_Store
.intlquals/
coverage/
```

```ts
// src/cli/commands/root.ts
import { Command } from "commander";

export function buildRootCommand(): Command {
  return new Command()
    .name("iq")
    .description("Terminal-first CLI for international qualifications research.")
    .version("0.1.0");
}
```

```ts
// src/cli/index.ts
import { buildRootCommand } from "./commands/root.js";

async function main() {
  await buildRootCommand().parseAsync(process.argv);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

- [ ] **Step 4: Run tests and typecheck**

Run: `npm test -- --run tests/unit/cli/smoke.test.ts && npm run lint:types`
Expected: PASS for the smoke test and no TypeScript errors

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json tsup.config.ts vitest.config.ts .gitignore src/cli/index.ts src/cli/commands/root.ts tests/unit/cli/smoke.test.ts
git commit -m "chore: scaffold typescript cli project"
```

### Task 2: Add core config, error handling, logging, and doctor command

**Files:**
- Create: `src/core/config.ts`
- Create: `src/core/errors.ts`
- Create: `src/core/logger.ts`
- Create: `src/core/result.ts`
- Create: `src/cli/commands/doctor.ts`
- Modify: `src/cli/commands/root.ts`
- Create: `tests/unit/core/config.test.ts`
- Create: `tests/unit/cli/doctor.test.ts`

- [ ] **Step 1: Write failing tests for config resolution and doctor output**

```ts
// tests/unit/core/config.test.ts
import { describe, expect, it } from "vitest";
import { resolveConfig } from "../../../src/core/config";

describe("resolveConfig", () => {
  it("uses IQ_DATA_DIR when present", () => {
    const config = resolveConfig({ IQ_DATA_DIR: "/tmp/iq-data" });
    expect(config.dataDir).toBe("/tmp/iq-data");
    expect(config.cacheDbPath).toBe("/tmp/iq-data/cache.sqlite");
  });
});
```

```ts
// tests/unit/cli/doctor.test.ts
import { describe, expect, it } from "vitest";
import { buildDoctorCommand } from "../../../src/cli/commands/doctor";

describe("doctor command", () => {
  it("is named doctor", () => {
    expect(buildDoctorCommand().name()).toBe("doctor");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run tests/unit/core/config.test.ts tests/unit/cli/doctor.test.ts`
Expected: FAIL with missing modules

- [ ] **Step 3: Implement config, errors, logger, and doctor command**

```ts
// src/core/config.ts
import os from "node:os";
import path from "node:path";

export interface AppConfig {
  dataDir: string;
  cacheDbPath: string;
  timeoutMs: number;
  logLevel: string;
}

export function resolveConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const dataDir = env.IQ_DATA_DIR ?? path.join(os.homedir(), ".intlquals");
  const timeoutMs = Number(env.IQ_TIMEOUT_MS ?? "15000");
  const logLevel = env.IQ_LOG_LEVEL ?? "info";

  return {
    dataDir,
    cacheDbPath: path.join(dataDir, "cache.sqlite"),
    timeoutMs,
    logLevel
  };
}
```

```ts
// src/core/errors.ts
export class AppError extends Error {
  constructor(message: string, readonly code = "APP_ERROR") {
    super(message);
    this.name = "AppError";
  }
}

export class ProviderError extends AppError {
  constructor(message: string, readonly provider: string) {
    super(message, "PROVIDER_ERROR");
    this.name = "ProviderError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}
```

```ts
// src/core/logger.ts
import pino from "pino";

export function createLogger(level = process.env.IQ_LOG_LEVEL ?? "info") {
  return pino({
    level,
    transport:
      process.env.NODE_ENV === "test"
        ? undefined
        : {
            target: "pino-pretty",
            options: {
              colorize: true
            }
          }
  });
}
```

```ts
// src/core/result.ts
export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err(error: Error): Result<never> {
  return { ok: false, error };
}
```

```ts
// src/cli/commands/doctor.ts
import { Command } from "commander";
import { resolveConfig } from "../../core/config.js";

export function buildDoctorCommand(): Command {
  return new Command("doctor")
    .description("Inspect local configuration and runtime settings.")
    .action(() => {
      const config = resolveConfig();
      console.log(JSON.stringify(config, null, 2));
    });
}
```

```ts
// src/cli/commands/root.ts
import { Command } from "commander";
import { buildDoctorCommand } from "./doctor.js";

export function buildRootCommand(): Command {
  return new Command()
    .name("iq")
    .description("Terminal-first CLI for international qualifications research.")
    .version("0.1.0")
    .addCommand(buildDoctorCommand());
}
```

- [ ] **Step 4: Run tests and confirm doctor output manually**

Run: `npm test -- --run tests/unit/core/config.test.ts tests/unit/cli/doctor.test.ts && npm run dev -- doctor`
Expected:
- tests PASS
- `doctor` prints JSON with `dataDir`, `cacheDbPath`, `timeoutMs`, and `logLevel`

- [ ] **Step 5: Commit**

```bash
git add src/core/config.ts src/core/errors.ts src/core/logger.ts src/core/result.ts src/cli/commands/doctor.ts src/cli/commands/root.ts tests/unit/core/config.test.ts tests/unit/cli/doctor.test.ts
git commit -m "feat: add core config and doctor command"
```

### Task 3: Define domain models and export serializers

**Files:**
- Create: `src/domain/models/source.ts`
- Create: `src/domain/models/ranking.ts`
- Create: `src/domain/models/school.ts`
- Create: `src/domain/models/export-task.ts`
- Create: `src/domain/models/snapshot.ts`
- Create: `src/infra/serializers/json.ts`
- Create: `src/infra/serializers/csv.ts`
- Create: `src/infra/serializers/markdown.ts`
- Create: `src/domain/services/export-data.ts`
- Create: `tests/unit/infra/serializers/csv.test.ts`
- Create: `tests/unit/infra/serializers/markdown.test.ts`

- [ ] **Step 1: Write failing serializer tests**

```ts
// tests/unit/infra/serializers/csv.test.ts
import { describe, expect, it } from "vitest";
import { toCsv } from "../../../../src/infra/serializers/csv";

describe("toCsv", () => {
  it("serializes rows with a header", () => {
    const output = toCsv([{ id: 1, name: "Shanghai High School" }]);
    expect(output).toContain("id,name");
    expect(output).toContain("1,Shanghai High School");
  });
});
```

```ts
// tests/unit/infra/serializers/markdown.test.ts
import { describe, expect, it } from "vitest";
import { toMarkdownTable } from "../../../../src/infra/serializers/markdown";

describe("toMarkdownTable", () => {
  it("renders a simple markdown table", () => {
    const output = toMarkdownTable([{ rank: 1, school: "SCIE" }]);
    expect(output).toContain("| rank | school |");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run tests/unit/infra/serializers/csv.test.ts tests/unit/infra/serializers/markdown.test.ts`
Expected: FAIL with missing serializer modules

- [ ] **Step 3: Add domain models and serializers**

```ts
// src/domain/models/source.ts
export interface SourceRecord {
  id: string;
  provider: string;
  type: string;
  originUrl: string;
  fetchedAt: string;
  licenseNote?: string;
  rawFingerprint?: string;
}
```

```ts
// src/domain/models/ranking.ts
export interface Ranking {
  id: string;
  provider: string;
  title: string;
  titleEn?: string;
  year?: number;
  scope?: string;
  region?: string;
  description?: string;
  methodology?: string;
  sourceRef?: SourceRecord;
}

export interface RankingEntry {
  rankingId: string;
  entityId: string;
  rank: number;
  score?: number;
  labels: string[];
  snapshotId?: string;
}
```

```ts
// src/domain/models/school.ts
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
```

```ts
// src/domain/models/export-task.ts
export interface ExportTask {
  id: string;
  entityType: "ranking" | "school" | "search";
  format: "json" | "csv" | "md";
  outputPath: string;
  createdAt: string;
}
```

```ts
// src/domain/models/snapshot.ts
export interface Snapshot {
  id: string;
  provider: string;
  entityType: string;
  entityId: string;
  fetchedAt: string;
  versionHash: string;
}
```

```ts
// src/infra/serializers/json.ts
export function toJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}
```

```ts
// src/infra/serializers/csv.ts
function escapeCell(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];

  for (const row of rows) {
    lines.push(headers.map((header) => escapeCell(row[header])).join(","));
  }

  return `${lines.join("\n")}\n`;
}
```

```ts
// src/infra/serializers/markdown.ts
export function toMarkdownTable(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const headerRow = `| ${headers.join(" | ")} |`;
  const dividerRow = `| ${headers.map(() => "---").join(" | ")} |`;
  const bodyRows = rows.map((row) => `| ${headers.map((header) => String(row[header] ?? "")).join(" | ")} |`);

  return [headerRow, dividerRow, ...bodyRows].join("\n");
}
```

```ts
// src/domain/services/export-data.ts
import { toCsv } from "../../infra/serializers/csv.js";
import { toJson } from "../../infra/serializers/json.js";
import { toMarkdownTable } from "../../infra/serializers/markdown.js";

export type ExportFormat = "json" | "csv" | "md";

export function renderExport(rows: Array<Record<string, unknown>>, format: ExportFormat): string {
  if (format === "json") {
    return toJson(rows);
  }

  if (format === "csv") {
    return toCsv(rows);
  }

  return toMarkdownTable(rows);
}
```

- [ ] **Step 4: Run serializer tests**

Run: `npm test -- --run tests/unit/infra/serializers/csv.test.ts tests/unit/infra/serializers/markdown.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domain/models/source.ts src/domain/models/ranking.ts src/domain/models/school.ts src/domain/models/export-task.ts src/domain/models/snapshot.ts src/infra/serializers/json.ts src/infra/serializers/csv.ts src/infra/serializers/markdown.ts src/domain/services/export-data.ts tests/unit/infra/serializers/csv.test.ts tests/unit/infra/serializers/markdown.test.ts
git commit -m "feat: add domain models and export serializers"
```

### Task 4: Add HTTP, caching, provider registry, and source commands

**Files:**
- Create: `src/infra/http/retry.ts`
- Create: `src/infra/http/throttle.ts`
- Create: `src/infra/http/client.ts`
- Create: `src/infra/cache/keys.ts`
- Create: `src/infra/cache/sqlite.ts`
- Create: `src/providers/types.ts`
- Create: `src/providers/registry.ts`
- Create: `src/cli/commands/source.ts`
- Modify: `src/cli/commands/root.ts`
- Create: `tests/unit/providers/registry.test.ts`

- [ ] **Step 1: Write the failing provider registry test**

```ts
// tests/unit/providers/registry.test.ts
import { describe, expect, it } from "vitest";
import { createProviderRegistry } from "../../../src/providers/registry";

describe("provider registry", () => {
  it("lists admitranking", () => {
    const registry = createProviderRegistry();
    expect(registry.list().map((provider) => provider.id)).toContain("admitranking");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/unit/providers/registry.test.ts`
Expected: FAIL with missing provider registry

- [ ] **Step 3: Implement infrastructure and provider registry**

```ts
// src/infra/http/retry.ts
export async function withRetry<T>(run: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  throw lastError;
}
```

```ts
// src/infra/http/throttle.ts
let lastRun = 0;

export async function withThrottle<T>(run: () => Promise<T>, minDelayMs = 250): Promise<T> {
  const now = Date.now();
  const waitMs = Math.max(0, minDelayMs - (now - lastRun));

  if (waitMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  lastRun = Date.now();
  return run();
}
```

```ts
// src/infra/http/client.ts
import { request } from "undici";
import { withRetry } from "./retry.js";
import { withThrottle } from "./throttle.js";

export async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  return withRetry(() =>
    withThrottle(async () => {
      const response = await request(url, { method: "GET", headers });
      return response.body.json() as Promise<T>;
    })
  );
}
```

```ts
// src/infra/cache/keys.ts
export function buildCacheKey(parts: Array<string | number | undefined>): string {
  return parts.filter(Boolean).join(":");
}
```

```ts
// src/infra/cache/sqlite.ts
import Database from "better-sqlite3";

export class SqliteCache {
  private db: Database.Database;

  constructor(path: string) {
    this.db = new Database(path);
    this.db.exec("create table if not exists cache (key text primary key, value text not null)");
  }

  get(key: string): string | null {
    const row = this.db.prepare("select value from cache where key = ?").get(key) as { value: string } | undefined;
    return row?.value ?? null;
  }

  set(key: string, value: string): void {
    this.db.prepare("insert or replace into cache (key, value) values (?, ?)").run(key, value);
  }
}
```

```ts
// src/providers/types.ts
export interface SourceInfo {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface ProviderRegistryEntry {
  id: string;
  info: SourceInfo;
}
```

```ts
// src/providers/registry.ts
import type { ProviderRegistryEntry } from "./types.js";

const PROVIDERS: ProviderRegistryEntry[] = [
  {
    id: "admitranking",
    info: {
      id: "admitranking",
      name: "AdmitRanking",
      description: "AdmitRanking ranking and school data provider.",
      capabilities: ["rankings", "schools", "search", "export"]
    }
  }
];

export function createProviderRegistry() {
  return {
    list(): ProviderRegistryEntry[] {
      return PROVIDERS;
    },
    get(id: string): ProviderRegistryEntry | undefined {
      return PROVIDERS.find((provider) => provider.id === id);
    }
  };
}
```

```ts
// src/cli/commands/source.ts
import { Command } from "commander";
import { createProviderRegistry } from "../../providers/registry.js";

export function buildSourceCommand(): Command {
  const command = new Command("source").description("Inspect available data providers.");

  command
    .command("list")
    .description("List configured providers.")
    .action(() => {
      console.log(JSON.stringify(createProviderRegistry().list(), null, 2));
    });

  command
    .command("info")
    .argument("<provider>", "Provider id")
    .description("Show provider metadata.")
    .action((providerId: string) => {
      const provider = createProviderRegistry().get(providerId);
      console.log(JSON.stringify(provider ?? null, null, 2));
    });

  return command;
}
```

```ts
// src/cli/commands/root.ts
import { Command } from "commander";
import { buildDoctorCommand } from "./doctor.js";
import { buildSourceCommand } from "./source.js";

export function buildRootCommand(): Command {
  return new Command()
    .name("iq")
    .description("Terminal-first CLI for international qualifications research.")
    .version("0.1.0")
    .addCommand(buildSourceCommand())
    .addCommand(buildDoctorCommand());
}
```

- [ ] **Step 4: Add missing dependencies and run tests**

Update `package.json` dependencies:

```json
{
  "dependencies": {
    "better-sqlite3": "^11.10.0",
    "commander": "^13.1.0",
    "pino": "^9.7.0",
    "undici": "^7.8.0",
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "pino-pretty": "^13.0.0",
    "tsup": "^8.3.5",
    "tsx": "^4.19.3",
    "typescript": "^5.8.3",
    "vitest": "^3.1.4"
  }
}
```

Run: `npm install && npm test -- --run tests/unit/providers/registry.test.ts && npm run dev -- source list`
Expected:
- install succeeds
- registry test PASS
- `source list` prints one provider named `admitranking`

- [ ] **Step 5: Commit**

```bash
git add package.json src/infra/http/retry.ts src/infra/http/throttle.ts src/infra/http/client.ts src/infra/cache/keys.ts src/infra/cache/sqlite.ts src/providers/types.ts src/providers/registry.ts src/cli/commands/source.ts src/cli/commands/root.ts tests/unit/providers/registry.test.ts
git commit -m "feat: add provider registry and infrastructure primitives"
```

### Task 5: Implement AdmitRanking ranking support and rank commands

**Files:**
- Create: `src/providers/admitranking/endpoints.ts`
- Create: `src/providers/admitranking/schemas.ts`
- Create: `src/providers/admitranking/mapper.ts`
- Create: `src/providers/admitranking/signer.ts`
- Create: `src/providers/admitranking/client.ts`
- Create: `src/providers/admitranking/index.ts`
- Create: `src/domain/services/fetch-rankings.ts`
- Create: `src/cli/commands/rank.ts`
- Modify: `src/cli/commands/root.ts`
- Create: `tests/integration/providers/admitranking/rankings.test.ts`

- [ ] **Step 1: Write the failing ranking integration test using a fixture**

```ts
// tests/integration/providers/admitranking/rankings.test.ts
import { describe, expect, it } from "vitest";
import { mapRankingListItem } from "../../../../src/providers/admitranking/mapper";

describe("admitranking mapper", () => {
  it("maps a ranking list item into the shared model", () => {
    const ranking = mapRankingListItem({
      id: 52,
      title: "翠鹿最佳公立国际部排名",
      etitle: "Cuilu Best Public Intl Departments",
      year: 2026
    });

    expect(ranking.id).toBe("52");
    expect(ranking.titleEn).toBe("Cuilu Best Public Intl Departments");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/integration/providers/admitranking/rankings.test.ts`
Expected: FAIL with missing mapper

- [ ] **Step 3: Implement provider client, mapper, and rank services**

```ts
// src/providers/admitranking/endpoints.ts
export const ADMITRANKING_BASE_URL = "https://admitranking.com";

export function buildRankListUrl(page = 1, size = 20): string {
  return `${ADMITRANKING_BASE_URL}/mb/api/intl/rank/getRankByType?rankType=1&pn=${page}&size=${size}`;
}

export function buildRankDetailUrl(rankId: string): string {
  return `${ADMITRANKING_BASE_URL}/mb/api/intl/rank/getRankDetail?rankId=${rankId}`;
}

export function buildRankEntriesUrl(rankId: string, page = 1, size = 20): string {
  return `${ADMITRANKING_BASE_URL}/mb/api/intl/school/getComPageRankEnV2`;
}
```

```ts
// src/providers/admitranking/schemas.ts
import { z } from "zod";

export const admitRankingListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  etitle: z.string().optional(),
  year: z.number().optional()
});

export const admitRankingEntrySchema = z.object({
  id: z.number(),
  rank: z.number().optional(),
  curriculumLabels: z.array(z.string()).optional()
});
```

```ts
// src/providers/admitranking/signer.ts
export interface RequestSigner {
  sign(params: Record<string, unknown>): Record<string, unknown>;
}

export class NoopSigner implements RequestSigner {
  sign(params: Record<string, unknown>): Record<string, unknown> {
    return params;
  }
}
```

```ts
// src/providers/admitranking/mapper.ts
import type { Ranking, RankingEntry } from "../../domain/models/ranking.js";

export function mapRankingListItem(input: Record<string, unknown>): Ranking {
  return {
    id: String(input.id),
    provider: "admitranking",
    title: String(input.title ?? ""),
    titleEn: input.etitle ? String(input.etitle) : undefined,
    year: typeof input.year === "number" ? input.year : undefined
  };
}

export function mapRankingEntry(input: Record<string, unknown>, rankingId: string): RankingEntry {
  const labels = Array.isArray(input.curriculumLabels)
    ? input.curriculumLabels.map((item) => String(item))
    : [];

  return {
    rankingId,
    entityId: String(input.id),
    rank: Number(input.rank ?? 0),
    labels
  };
}
```

```ts
// src/providers/admitranking/client.ts
import { request } from "undici";
import { buildRankDetailUrl, buildRankEntriesUrl, buildRankListUrl } from "./endpoints.js";

const JSON_HEADERS = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json; charset=UTF-8"
};

export class AdmitRankingClient {
  async getRankList(page = 1, size = 20): Promise<any> {
    const response = await request(buildRankListUrl(page, size), {
      method: "GET",
      headers: JSON_HEADERS
    });

    return response.body.json();
  }

  async getRankDetail(rankId: string): Promise<any> {
    const response = await request(buildRankDetailUrl(rankId), {
      method: "GET",
      headers: JSON_HEADERS
    });

    return response.body.json();
  }

  async getRankEntries(rankId: string, page = 1, size = 20): Promise<any> {
    const response = await request(buildRankEntriesUrl(rankId, page, size), {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ rankId, pn: page, size })
    });

    return response.body.json();
  }
}
```

```ts
// src/providers/admitranking/index.ts
import { AdmitRankingClient } from "./client.js";
import { mapRankingEntry, mapRankingListItem } from "./mapper.js";

export class AdmitRankingProvider {
  readonly id = "admitranking";
  private client = new AdmitRankingClient();

  async listRankings(page = 1, size = 20) {
    const payload = await this.client.getRankList(page, size);
    return payload.data.list.map(mapRankingListItem);
  }

  async getRanking(rankId: string) {
    const payload = await this.client.getRankDetail(rankId);
    return mapRankingListItem(payload.data);
  }

  async listRankingEntries(rankId: string, page = 1, size = 20) {
    const payload = await this.client.getRankEntries(rankId, page, size);
    return payload.data.list.map((item: Record<string, unknown>) => mapRankingEntry(item, rankId));
  }
}
```

```ts
// src/domain/services/fetch-rankings.ts
import { AdmitRankingProvider } from "../../providers/admitranking/index.js";

const provider = new AdmitRankingProvider();

export async function fetchRankingList(page = 1, size = 20) {
  return provider.listRankings(page, size);
}

export async function fetchRanking(rankId: string) {
  return provider.getRanking(rankId);
}

export async function fetchRankingEntries(rankId: string, page = 1, size = 20) {
  return provider.listRankingEntries(rankId, page, size);
}
```

```ts
// src/cli/commands/rank.ts
import { Command } from "commander";
import { fetchRanking, fetchRankingEntries, fetchRankingList } from "../../domain/services/fetch-rankings.js";

export function buildRankCommand(): Command {
  const command = new Command("rank").description("Fetch and inspect rankings.");

  command.command("list").action(async () => {
    console.log(JSON.stringify(await fetchRankingList(), null, 2));
  });

  command.command("show").argument("<rankId>").action(async (rankId: string) => {
    console.log(JSON.stringify(await fetchRanking(rankId), null, 2));
  });

  command
    .command("entries")
    .argument("<rankId>")
    .option("--page <page>", "Page number", "1")
    .option("--size <size>", "Page size", "20")
    .action(async (rankId: string, options: { page: string; size: string }) => {
      console.log(JSON.stringify(await fetchRankingEntries(rankId, Number(options.page), Number(options.size)), null, 2));
    });

  return command;
}
```

```ts
// src/cli/commands/root.ts
import { Command } from "commander";
import { buildDoctorCommand } from "./doctor.js";
import { buildRankCommand } from "./rank.js";
import { buildSourceCommand } from "./source.js";

export function buildRootCommand(): Command {
  return new Command()
    .name("iq")
    .description("Terminal-first CLI for international qualifications research.")
    .version("0.1.0")
    .addCommand(buildSourceCommand())
    .addCommand(buildRankCommand())
    .addCommand(buildDoctorCommand());
}
```

- [ ] **Step 4: Run tests and a live command**

Run: `npm test -- --run tests/integration/providers/admitranking/rankings.test.ts && npm run dev -- rank list`
Expected:
- mapper test PASS
- `rank list` returns JSON array with ranking ids and titles

- [ ] **Step 5: Commit**

```bash
git add src/providers/admitranking/endpoints.ts src/providers/admitranking/schemas.ts src/providers/admitranking/mapper.ts src/providers/admitranking/signer.ts src/providers/admitranking/client.ts src/providers/admitranking/index.ts src/domain/services/fetch-rankings.ts src/cli/commands/rank.ts src/cli/commands/root.ts tests/integration/providers/admitranking/rankings.test.ts
git commit -m "feat: add admitranking ranking provider"
```

### Task 6: Implement school search, school detail, compare, and export commands

**Files:**
- Create: `src/domain/services/fetch-schools.ts`
- Create: `src/domain/services/compare-schools.ts`
- Modify: `src/providers/admitranking/client.ts`
- Modify: `src/providers/admitranking/index.ts`
- Modify: `src/providers/admitranking/mapper.ts`
- Create: `src/cli/commands/school.ts`
- Create: `src/cli/commands/export.ts`
- Modify: `src/cli/commands/root.ts`
- Create: `tests/unit/domain/compare-schools.test.ts`

- [ ] **Step 1: Write the failing school compare test**

```ts
// tests/unit/domain/compare-schools.test.ts
import { describe, expect, it } from "vitest";
import { compareSchools } from "../../../src/domain/services/compare-schools";

describe("compareSchools", () => {
  it("projects comparable school fields", () => {
    const rows = compareSchools([
      { id: "1", name: "A", provider: "admitranking", curricula: ["AP"], tags: [], stats: {}, city: "Shanghai" },
      { id: "2", name: "B", provider: "admitranking", curricula: ["IB"], tags: [], stats: {}, city: "Beijing" }
    ]);

    expect(rows[0]).toEqual({
      id: "1",
      name: "A",
      city: "Shanghai",
      curricula: "AP"
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/unit/domain/compare-schools.test.ts`
Expected: FAIL with missing compare service

- [ ] **Step 3: Extend provider for school workflows and export**

```ts
// src/providers/admitranking/client.ts
// append methods to the existing class
  async searchSchools(keyword = "", page = 1, size = 20): Promise<any> {
    const response = await request("https://admitranking.com/mb/api/intl/school/getComPageRankEnV2", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ keyword, pn: page, size })
    });

    return response.body.json();
  }

  async getSchool(comId: string): Promise<any> {
    const response = await request(`https://admitranking.com/mb/api/intl/school/getComDetailById?comId=${comId}`, {
      method: "GET",
      headers: JSON_HEADERS
    });

    return response.body.json();
  }
```

```ts
// src/providers/admitranking/mapper.ts
import type { School } from "../../domain/models/school.js";

export function mapSchool(input: Record<string, unknown>): School {
  return {
    id: String(input.id),
    provider: "admitranking",
    name: String(input.title ?? input.name ?? ""),
    nameEn: input.titleEn ? String(input.titleEn) : undefined,
    country: input.countryName ? String(input.countryName) : undefined,
    province: input.provinceName ? String(input.provinceName) : undefined,
    city: input.cityName ? String(input.cityName) : undefined,
    schoolType: input.typeTitle ? String(input.typeTitle) : undefined,
    curricula: Array.isArray(input.curriculumLabels) ? input.curriculumLabels.map((item) => String(item)) : [],
    gradeRange: typeof input.gradeStart === "number" && typeof input.gradeEnd === "number"
      ? `${input.gradeStart}-${input.gradeEnd}`
      : undefined,
    tags: typeof input.labels === "string" ? String(input.labels).split(",").filter(Boolean) : [],
    stats: {
      rank: input.rank,
      judgeCount: input.judgeCount,
      transparency: input.dataTransparencyInt
    }
  };
}
```

```ts
// src/providers/admitranking/index.ts
// append methods to the existing provider
  async searchSchools(keyword = "", page = 1, size = 20) {
    const payload = await this.client.searchSchools(keyword, page, size);
    return payload.data.list.map(mapSchool);
  }

  async getSchool(comId: string) {
    const payload = await this.client.getSchool(comId);
    return mapSchool(payload.data);
  }
```

```ts
// src/domain/services/fetch-schools.ts
import { AdmitRankingProvider } from "../../providers/admitranking/index.js";

const provider = new AdmitRankingProvider();

export async function searchSchools(keyword: string, page = 1, size = 20) {
  return provider.searchSchools(keyword, page, size);
}

export async function fetchSchool(comId: string) {
  return provider.getSchool(comId);
}
```

```ts
// src/domain/services/compare-schools.ts
import type { School } from "../models/school.js";

export function compareSchools(schools: School[]) {
  return schools.map((school) => ({
    id: school.id,
    name: school.name,
    city: school.city ?? "",
    curricula: school.curricula.join(",")
  }));
}
```

```ts
// src/cli/commands/school.ts
import { Command } from "commander";
import { compareSchools } from "../../domain/services/compare-schools.js";
import { fetchSchool, searchSchools } from "../../domain/services/fetch-schools.js";

export function buildSchoolCommand(): Command {
  const command = new Command("school").description("Search and inspect schools.");

  command
    .command("search")
    .option("--keyword <keyword>", "Search keyword", "")
    .action(async (options: { keyword: string }) => {
      console.log(JSON.stringify(await searchSchools(options.keyword), null, 2));
    });

  command.command("show").argument("<comId>").action(async (comId: string) => {
    console.log(JSON.stringify(await fetchSchool(comId), null, 2));
  });

  command.command("compare").argument("<ids...>").action(async (ids: string[]) => {
    const schools = await Promise.all(ids.map((id) => fetchSchool(id)));
    console.log(JSON.stringify(compareSchools(schools), null, 2));
  });

  return command;
}
```

```ts
// src/cli/commands/export.ts
import { Command } from "commander";
import { writeFile } from "node:fs/promises";
import { renderExport } from "../../domain/services/export-data.js";
import { fetchRankingEntries } from "../../domain/services/fetch-rankings.js";
import { fetchSchool, searchSchools } from "../../domain/services/fetch-schools.js";

export function buildExportCommand(): Command {
  const command = new Command("export").description("Export rankings and schools.");

  command
    .command("rank")
    .argument("<rankId>")
    .requiredOption("--format <format>", "json|csv|md")
    .requiredOption("--output <output>", "Output file path")
    .action(async (rankId: string, options: { format: "json" | "csv" | "md"; output: string }) => {
      const rows = await fetchRankingEntries(rankId);
      await writeFile(options.output, renderExport(rows as unknown as Array<Record<string, unknown>>, options.format), "utf8");
    });

  command
    .command("school")
    .argument("<comId>")
    .requiredOption("--format <format>", "json|csv|md")
    .requiredOption("--output <output>", "Output file path")
    .action(async (comId: string, options: { format: "json" | "csv" | "md"; output: string }) => {
      const row = await fetchSchool(comId);
      await writeFile(options.output, renderExport([row as unknown as Record<string, unknown>], options.format), "utf8");
    });

  command
    .command("search")
    .option("--keyword <keyword>", "Search keyword", "")
    .requiredOption("--format <format>", "json|csv|md")
    .requiredOption("--output <output>", "Output file path")
    .action(async (options: { keyword: string; format: "json" | "csv" | "md"; output: string }) => {
      const rows = await searchSchools(options.keyword);
      await writeFile(options.output, renderExport(rows as unknown as Array<Record<string, unknown>>, options.format), "utf8");
    });

  return command;
}
```

```ts
// src/cli/commands/root.ts
import { Command } from "commander";
import { buildDoctorCommand } from "./doctor.js";
import { buildExportCommand } from "./export.js";
import { buildRankCommand } from "./rank.js";
import { buildSchoolCommand } from "./school.js";
import { buildSourceCommand } from "./source.js";

export function buildRootCommand(): Command {
  return new Command()
    .name("iq")
    .description("Terminal-first CLI for international qualifications research.")
    .version("0.1.0")
    .addCommand(buildSourceCommand())
    .addCommand(buildRankCommand())
    .addCommand(buildSchoolCommand())
    .addCommand(buildExportCommand())
    .addCommand(buildDoctorCommand());
}
```

- [ ] **Step 4: Run tests and verify core user flows**

Run:
- `npm test -- --run tests/unit/domain/compare-schools.test.ts`
- `npm run dev -- school search --keyword AP`
- `npm run dev -- school compare 90 103`
- `npm run dev -- export rank 52 --format json --output ./tmp-rank.json`

Expected:
- compare test PASS
- school search returns school rows
- school compare returns a compact comparison table payload
- export writes `./tmp-rank.json`

- [ ] **Step 5: Commit**

```bash
git add src/domain/services/fetch-schools.ts src/domain/services/compare-schools.ts src/providers/admitranking/client.ts src/providers/admitranking/index.ts src/providers/admitranking/mapper.ts src/cli/commands/school.ts src/cli/commands/export.ts src/cli/commands/root.ts tests/unit/domain/compare-schools.test.ts
git commit -m "feat: add school workflows and export commands"
```

### Task 7: Add cache command, polish output, and finalize README and compliance docs

**Files:**
- Create: `src/cli/commands/cache.ts`
- Modify: `src/cli/commands/root.ts`
- Create: `README.md`
- Create: `docs/compliance.md`
- Create: `tests/unit/cli/cache.test.ts`

- [ ] **Step 1: Write the failing cache command test**

```ts
// tests/unit/cli/cache.test.ts
import { describe, expect, it } from "vitest";
import { buildCacheCommand } from "../../../src/cli/commands/cache";

describe("cache command", () => {
  it("exposes the status subcommand", () => {
    const command = buildCacheCommand();
    expect(command.commands.map((item) => item.name())).toContain("status");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/unit/cli/cache.test.ts`
Expected: FAIL with missing cache command

- [ ] **Step 3: Implement cache command and write top-level docs**

```ts
// src/cli/commands/cache.ts
import { Command } from "commander";
import { rm } from "node:fs/promises";
import { resolveConfig } from "../../core/config.js";

export function buildCacheCommand(): Command {
  const command = new Command("cache").description("Inspect or clear local cache.");

  command.command("status").action(() => {
    console.log(JSON.stringify({ cacheDbPath: resolveConfig().cacheDbPath }, null, 2));
  });

  command.command("clear").action(async () => {
    await rm(resolveConfig().cacheDbPath, { force: true });
    console.log("Cache cleared.");
  });

  return command;
}
```

```ts
// src/cli/commands/root.ts
import { Command } from "commander";
import { buildCacheCommand } from "./cache.js";
import { buildDoctorCommand } from "./doctor.js";
import { buildExportCommand } from "./export.js";
import { buildRankCommand } from "./rank.js";
import { buildSchoolCommand } from "./school.js";
import { buildSourceCommand } from "./source.js";

export function buildRootCommand(): Command {
  return new Command()
    .name("iq")
    .description("Terminal-first CLI for international qualifications research.")
    .version("0.1.0")
    .addCommand(buildSourceCommand())
    .addCommand(buildRankCommand())
    .addCommand(buildSchoolCommand())
    .addCommand(buildExportCommand())
    .addCommand(buildCacheCommand())
    .addCommand(buildDoctorCommand());
}
```

```md
<!-- README.md -->
# intlquals

Terminal-first, AI-native CLI for international qualifications research.

## MVP

- AdmitRanking provider
- ranking list, detail, and entries
- school search, detail, and compare
- export to JSON, CSV, and Markdown
- provider-first architecture for future expansion

## Examples

- `iq rank list`
- `iq rank show 52`
- `iq school search --keyword "AP"`
- `iq school compare 90 103 32`
- `iq export rank 52 --format csv --output ranks.csv`
```

```md
<!-- docs/compliance.md -->
# Compliance Notes

- Providers use third-party sources owned by their original publishers.
- Endpoint behavior may change without notice.
- Use conservative request rates and respect source-specific terms.
- Do not treat this project as a bulk redistribution platform.
- Exam papers and copyrighted files are intentionally out of scope for v0.1.
```

- [ ] **Step 4: Run the final verification set**

Run:
- `npm test`
- `npm run lint:types`
- `npm run build`
- `npm run dev -- cache status`

Expected:
- all tests PASS
- typecheck PASS
- build completes
- cache status prints the resolved cache database path

- [ ] **Step 5: Commit**

```bash
git add src/cli/commands/cache.ts src/cli/commands/root.ts README.md docs/compliance.md tests/unit/cli/cache.test.ts
git commit -m "docs: polish cli docs and cache command"
```

## Self-Review

### Spec coverage

- Product scope is implemented through a narrow CLI shell and AdmitRanking-only provider.
- Pipeline-first architecture is covered by the split between CLI, services, provider, and infra.
- MVP ranking and school workflows are covered.
- Export support is covered.
- Operational concerns are covered through config, retry, throttling, cache, and docs.

### Placeholder scan

No `TODO`, `TBD`, or undefined task placeholders should remain before execution begins.

### Type consistency

- `Ranking`, `RankingEntry`, and `School` are the shared shapes used by services and commands.
- `AdmitRankingProvider` is the first concrete provider.
- `iq` remains the CLI executable name throughout.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-06-intlquals-v0-1-mvp.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
