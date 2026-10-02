import Link from "next/link";

type ToolKey = "finder" | "stories" | "reposts";

type RelatedToolsProps = {
  current: ToolKey;
};

const linkClass = "font-medium text-teal-800 underline";

export function RelatedTools({ current }: RelatedToolsProps) {
  if (current === "finder") {
    return (
      <p className="max-w-2xl text-sm leading-6 text-zinc-600">
        Looking for public stories instead? Open the{" "}
        <Link href="/tiktok-story-viewer" className={linkClass}>
          TikTok Story Viewer
        </Link>{" "}
        to watch them anonymously, or see what an account shared with the{" "}
        <Link href="/tiktok-repost-viewer" className={linkClass}>
          TikTok Repost Viewer
        </Link>
        .
      </p>
    );
  }

  if (current === "stories") {
    return (
      <p className="max-w-2xl text-sm leading-6 text-zinc-600">
        Need User ID, region, or other public profile fields? Use the{" "}
        <Link href="/" className={linkClass}>
          TikTok User Finder
        </Link>
        . To see videos an account reposted, open the{" "}
        <Link href="/tiktok-repost-viewer" className={linkClass}>
          TikTok Repost Viewer
        </Link>
        .
      </p>
    );
  }

  return (
    <p className="max-w-2xl text-sm leading-6 text-zinc-600">
      Need User ID or region? Use the{" "}
      <Link href="/" className={linkClass}>
        TikTok User Finder
      </Link>
      . For currently active stories, open the{" "}
      <Link href="/tiktok-story-viewer" className={linkClass}>
        TikTok Story Viewer
      </Link>
      .
    </p>
  );
}
