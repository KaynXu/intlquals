export interface SourceRecord {
  id: string;
  provider: string;
  type: string;
  originUrl: string;
  fetchedAt: string;
  licenseNote?: string;
  rawFingerprint?: string;
}
