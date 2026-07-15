export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/** The request never reached the server at all (connection refused, DNS
 * failure, the backend restarting mid-request, offline, etc.) — distinct
 * from the server responding with an error. */
export class NetworkError extends Error {
  constructor() {
    super("Couldn't reach the FrameScore AI server. Check that the backend is running and try again.");
    this.name = "NetworkError";
  }
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof NetworkError || err instanceof ApiError) return err.message;
  return fallback;
}

export function assetUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

async function parseError(response: Response): Promise<never> {
  let message = `Request failed with status ${response.status}`;
  try {
    const body = await response.json();
    if (body?.detail) message = body.detail;
  } catch {
    // response had no JSON body
  }
  throw new ApiError(response.status, message);
}

async function safeFetch(input: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    // fetch() only throws for network-level failures, never for HTTP error
    // status codes — those are handled separately via parseError().
    throw new NetworkError();
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await safeFetch(`${API_BASE_URL}${path}`);
  if (!response.ok) return parseError(response);
  return response.json() as Promise<T>;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await safeFetch(`${API_BASE_URL}${path}`, { method: "DELETE" });
  if (!response.ok) return parseError(response);
  return response.json() as Promise<T>;
}

export async function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  const response = await safeFetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) return parseError(response);
  return response.json() as Promise<T>;
}
