import { AdmitRankingProvider } from "../../../providers/admitranking/index.js";

const provider = new AdmitRankingProvider();

export async function fetchSchool(comId: string) {
  return provider.getSchool(comId);
}
