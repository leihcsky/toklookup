import { getCachedRepostMedia } from "@/lib/cache/reposts";
import { streamTikTokMedia } from "@/lib/tiktok/media-proxy";
import { normalizeUsername } from "@/lib/tiktok/username";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = normalizeUsername(searchParams.get("username") ?? "");
  const id = searchParams.get("id") ?? "";

  if (!username || !/^\d{1,30}$/.test(id)) {
    return Response.json({ error: "Missing username or video id." }, { status: 400 });
  }

  const source = getCachedRepostMedia(username, id);
  if (!source) {
    return Response.json(
      { error: "This repost is no longer cached. Search the account again to reload it." },
      { status: 404 },
    );
  }

  return streamTikTokMedia(request, {
    sourceUrl: source.playUrl,
    referer: source.referer,
    cookies: source.cookies,
    fallbackType: "video/mp4",
  });
}
