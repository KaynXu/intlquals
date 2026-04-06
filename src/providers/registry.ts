import type { ProviderRegistryEntry } from "./types.js";

const PROVIDERS: ProviderRegistryEntry[] = [
  {
    id: "admitranking",
    info: {
      id: "admitranking",
      name: "AdmitRanking",
      description: "AdmitRanking ranking and school data provider.",
      capabilities: ["rankings", "schools", "search", "export"]
    }
  }
];

export function createProviderRegistry() {
  return {
    list(): ProviderRegistryEntry[] {
      return PROVIDERS;
    },
    get(id: string): ProviderRegistryEntry | undefined {
      return PROVIDERS.find((provider) => provider.id === id);
    }
  };
}
