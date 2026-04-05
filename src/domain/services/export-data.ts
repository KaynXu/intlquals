import { toCsv } from "../../infra/serializers/csv.js";
import { toJson } from "../../infra/serializers/json.js";
import { toMarkdownTable } from "../../infra/serializers/markdown.js";

export type ExportFormat = "json" | "csv" | "md";

export function renderExport(
  rows: Array<Record<string, unknown>>,
  format: ExportFormat
): string {
  if (format === "json") {
    return toJson(rows);
  }

  if (format === "csv") {
    return toCsv(rows);
  }

  return toMarkdownTable(rows);
}
