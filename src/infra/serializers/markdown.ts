export function toMarkdownTable(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const headerRow = `| ${headers.join(" | ")} |`;
  const dividerRow = `| ${headers.map(() => "---").join(" | ")} |`;
  const bodyRows = rows.map(
    (row) => `| ${headers.map((header) => String(row[header] ?? "")).join(" | ")} |`
  );

  return [headerRow, dividerRow, ...bodyRows].join("\n");
}
