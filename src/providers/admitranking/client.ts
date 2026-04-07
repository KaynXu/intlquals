import { request } from "undici";
import { buildRankEntriesUrl, buildRankListUrl } from "./endpoints.js";

const JSON_HEADERS = {
  "X-Requested-With": "XMLHttpRequest",
  "Content-Type": "application/json; charset=UTF-8"
};

export class AdmitRankingClient {
  async getRankList(page = 1, size = 20): Promise<any> {
    const response = await request(buildRankListUrl(page, size), {
      method: "GET",
      headers: JSON_HEADERS
    });

    return response.body.json();
  }

  async getRankEntries(rankId: string, page = 1, size = 20): Promise<any> {
    const response = await request(buildRankEntriesUrl(), {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ rankId, pn: page, size })
    });

    return response.body.json();
  }

  async getSchool(comId: string): Promise<any> {
    const response = await request(
      `https://admitranking.com/mb/api/intl/school/getComDetailById?comId=${comId}`,
      {
        method: "GET",
        headers: JSON_HEADERS
      }
    );

    return response.body.json();
  }
}
