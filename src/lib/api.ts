import { error } from "@sveltejs/kit";
import { invalidateAll } from "$app/navigation";
import { browser } from "$app/environment";

const apiUrl = "https://api.critical-notes.com/api";

type Fetch = (
  info: RequestInfo,
  init?: RequestInit | undefined
) => Promise<Response>;

async function send<T>({
  method,
  fetch,
  url,
  body,
}: {
  method: string;
  fetch: Fetch;
  url: string;
  body?: string;
}): Promise<T> {
  const config: RequestInit = { method };
  const headers: Record<string, string> = {
    origin: "http://127.0.0.1:5173",
  };

  if (body) {
    headers["Content-Type"] = "application/json";
    config.body = body;
  }

  config.headers = headers;

  console.log(`Making ${method} request to ${url}`);
  const request = new Request(url, config);
  const response = await fetch(request);
  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch (err) {
    result = text;
  }

  // API error, retrieve the error message from the result
  if (!response.ok) {
    let reason: string | undefined = result.reason;

    if (!reason) {
      let reasons = [];

      if (Array.isArray(result)) {
        reasons = result;
      } else if (typeof result === "object") {
        for (const key in result) {
          reasons.push(`${key}: ${result[key]}`);
        }
      }

      reason = reasons.join("\n\n");
    }

    throw error(400, {
      message: reason || "Error when talking to the server. Please try again.",
      errors: { foo: ["Just some dummy data"] },
    });
  }

  // All good!
  return result;
}

function createUrl(path: string) {
  return path.startsWith("http")
    ? path
    : `${apiUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function postApi<T>(
  fetch: Fetch,
  path: string,
  data: object
): Promise<T> {
  const url = createUrl(path);
  const body = JSON.stringify(data);
  return send<T>({ method: "POST", fetch, url, body });
}

export function postLocal<T>(
  fetch: Fetch,
  path: string,
  data: object = {}
): Promise<T> {
  const body = JSON.stringify(data);
  return send<T>({ method: "POST", fetch, url: path, body });
}
