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
