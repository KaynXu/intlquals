export function buildCacheKey(parts: Array<string | number | undefined>): string {
  return parts.filter((part): part is string | number => part !== undefined && part !== "").join(":");
}
