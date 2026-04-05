export interface ExportTask {
  id: string;
  entityType: "ranking" | "school" | "search";
  format: "json" | "csv" | "md";
  outputPath: string;
  createdAt: string;
}
