import { request } from "undici";
import { withRetry } from "./retry.js";
import { withThrottle } from "./throttle.js";

export async function getJson<T>(
  url: string,
  headers: Record<string, string> = {}
): Promise<T> {
  return withRetry(() =>
    withThrottle(async () => {
      const response = await request(url, {
        method: "GET",
        headers
      });

      return response.body.json() as Promise<T>;
    })
  );
}
