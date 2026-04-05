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
