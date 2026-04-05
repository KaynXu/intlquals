import { AdmitRankingProvider } from "../../providers/admitranking/index.js";

const provider = new AdmitRankingProvider();

export async function searchSchools(keyword: string, page = 1, size = 20) {
  return provider.searchSchools(keyword, page, size);
}

export async function fetchSchool(comId: string) {
  return provider.getSchool(comId);
}
