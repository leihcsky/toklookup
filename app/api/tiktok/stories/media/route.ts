import { proxyStoryAsset } from "@/lib/tiktok/story-media";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyStoryAsset(request);
}
