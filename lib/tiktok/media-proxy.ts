import { isAllowedMediaUrl } from "./stories-parser";

const FETCH_TIMEOUT_MS = 45_000;
const MEDIA_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

type StreamOptions = {
  sourceUrl: string | null;
  referer: string;
  cookies: string | null;
  fallbackType: string;
  attachmentName?: string;
};

export async function streamTikTokMedia(
  request: Request,
  { sourceUrl, referer, cookies, fallbackType, attachmentName }: StreamOptions,
): Promise<Response> {
  if (!sourceUrl || !isAllowedMediaUrl(sourceUrl)) {
    return Response.json({ error: "That public file is no longer available." }, { status: 404 });
  }

  const range = request.headers.get("range");
  let upstream: Response;
  try {
    upstream = await fetchMedia(sourceUrl, referer, cookies, range);
    if (!upstream.ok && upstream.status !== 206 && range) {
      upstream = await fetchMedia(sourceUrl, referer, cookies, null);
    }
  } catch {
    return Response.json({ error: "The file could not be loaded." }, { status: 502 });
  }

  if ((!upstream.ok && upstream.status !== 206) || !upstream.body) {
    return Response.json({ error: "The file could not be loaded." }, { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || fallbackType);
  headers.set("Cache-Control", "private, max-age=60");
  headers.set(
    "Content-Disposition",
    attachmentName ? `attachment; filename="${attachmentName}"` : "inline",
  );
  headers.set("Accept-Ranges", upstream.headers.get("accept-ranges") || "bytes");

  const contentRange = upstream.headers.get("content-range");
  const contentLength = upstream.headers.get("content-length");
  if (contentRange) {
    headers.set("Content-Range", contentRange);
  }
  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}

function fetchMedia(
  sourceUrl: string,
  referer: string,
  cookies: string | null,
  range: string | null,
): Promise<Response> {
  return fetch(sourceUrl, {
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": MEDIA_UA,
      Referer: referer,
      Origin: "https://www.tiktok.com",
      ...(cookies ? { Cookie: cookies } : {}),
      ...(range ? { Range: range } : {}),
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}
