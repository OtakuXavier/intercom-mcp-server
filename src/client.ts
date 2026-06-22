import { getToken } from "./auth.js";

const BASE_URL = "https://api.intercom.io";
const INTERCOM_VERSION = "2.11";

export async function intercomRequest(
  method: string,
  path: string,
  body?: unknown,
  queryParams?: Record<string, string | number | boolean | undefined>
): Promise<unknown> {
  const url = new URL(`${BASE_URL}${path}`);
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Intercom-Version": INTERCOM_VERSION,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Intercom API error ${res.status}: ${text}`);
  }
  return text ? JSON.parse(text) : {};
}
