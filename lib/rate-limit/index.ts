const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

type WindowState = {
  count: number;
  resetAt: number;
};

const windows = new Map<string, WindowState>();

export function allowRequest(ip: string): boolean {
  const now = Date.now();
  const current = windows.get(ip);

  if (!current || now >= current.resetAt) {
    windows.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_REQUESTS) {
    return false;
  }

  current.count += 1;
  return true;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
