export interface Snapshot {
  id: string;
  provider: string;
  entityType: string;
  entityId: string;
  fetchedAt: string;
  versionHash: string;
}
