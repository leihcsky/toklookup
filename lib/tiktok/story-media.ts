import { getCachedStories, getCachedStoryCookies, setCachedStories } from "@/lib/cache/stories";
import { allowRequest, getClientIp } from "@/lib/rate-limit";
import { isAllowedMediaUrl } from "@/lib/tiktok/stories-parser";
import { lookupPublicStories } from "@/lib/tiktok/stories-provider";
import type { TikTokStory } from "@/lib/tiktok/types";
import { normalizeUsername } from "@/lib/tiktok/username";

const FETCH_TIMEOUT_MS = 45_000;
const MEDIA_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export async function proxyStoryAsset(
  request: Request,
  options: { download?: boolean } = {},
): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const username = normalizeUsername(searchParams.get("username") ?? "");
  const itemId = searchParams.get("id") ?? "";
  const kind = searchParams.get("kind") === "cover" ? "cover" : "play";

  if (!username || !itemId) {
    return Response.json({ error: "Missing username or story id." }, { status: 400 });
  }

  const resolved = await resolveStory(username, itemId, request);
  if (resolved instanceof Response) {
    return resolved;
  }

  const sourceUrl =
    kind === "cover"
      ? resolved.story.coverUrl || resolved.story.mediaUrl
      : resolved.story.mediaUrl;

  if (!sourceUrl || !isAllowedMediaUrl(sourceUrl)) {
    return Response.json(
      { error: "That public story is no longer available." },
      { status: 404 },
    );
  }

  const range = request.headers.get("range");
  let upstream: Response;
  try {
    upstream = await fetchTikTokMedia(sourceUrl, username, resolved.cookies, range);
    if (!upstream.ok && upstream.status !== 206 && range) {
      upstream = await fetchTikTokMedia(sourceUrl, username, resolved.cookies, null);
    }
  } catch {
    return Response.json({ error: "The story file could not be loaded." }, { status: 502 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    return Response.json({ error: "The story file could not be loaded." }, { status: 502 });
  }

  if (!upstream.body) {
    return Response.json({ error: "The story file could not be loaded." }, { status: 502 });
  }

  const extension = resolved.story.type === "photo" ? "jpg" : "mp4";
  const contentType =
    upstream.headers.get("content-type") ||
    (kind === "cover" || resolved.story.type === "photo" ? "image/jpeg" : "video/mp4");

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "private, max-age=60");
  headers.set(
    "Content-Disposition",
    options.download
      ? `attachment; filename="${username}-story-${itemId}.${extension}"`
      : "inline",
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

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}

async function resolveStory(
  username: string,
  itemId: string,
  request: Request,
): Promise<{ story: TikTokStory; cookies: string | null } | Response> {
  let result = getCachedStories(username);
  let cookies = getCachedStoryCookies(username);

  if (!result) {
    const ip = getClientIp(request);
    if (!allowRequest(ip)) {
      return Response.json({ error: "Too many lookups." }, { status: 429 });
    }

    const lookup = await lookupPublicStories(username);
    result = lookup.result;
    cookies = lookup.cookies;
    setCachedStories(username, lookup.result, lookup.cookies);
  }

  if (result.status !== "success") {
    return Response.json({ error: "No public story to load." }, { status: 404 });
  }

  const story = result.stories.find((item) => item.id === itemId);
  if (!story) {
    return Response.json({ error: "That public story is no longer available." }, { status: 404 });
  }

  return { story, cookies };
}

async function fetchTikTokMedia(
  sourceUrl: string,
  username: string,
  cookies: string | null,
  range: string | null,
): Promise<Response> {
  return fetch(sourceUrl, {
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": MEDIA_UA,
      Referer: `https://www.tiktok.com/@${encodeURIComponent(username)}`,
      Origin: "https://www.tiktok.com",
      ...(cookies ? { Cookie: cookies } : {}),
      ...(range ? { Range: range } : {}),
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}
