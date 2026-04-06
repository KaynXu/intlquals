import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(import.meta.dirname, "../../..");

describe("package installability", () => {
  it("points the iq bin entry at the built CLI file", async () => {
    const packageJson = JSON.parse(
      await readFile(path.join(rootDir, "package.json"), "utf8")
    ) as {
      bin?: Record<string, string>;
    };

    expect(packageJson.bin?.iq).toBe("./dist/index.js");
  });

  it("keeps a node shebang in the CLI entry source", async () => {
    const source = await readFile(path.join(rootDir, "src/cli/index.ts"), "utf8");

    expect(source.startsWith("#!/usr/bin/env node")).toBe(true);
  });
});
