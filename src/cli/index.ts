#!/usr/bin/env node

import { buildRootCommand } from "./commands/root.js";

async function main() {
  await buildRootCommand().parseAsync(process.argv);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
