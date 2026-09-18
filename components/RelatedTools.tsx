import Link from "next/link";

type RelatedToolsProps = {
  current: "finder" | "stories";
};

export function RelatedTools({ current }: RelatedToolsProps) {
  if (current === "finder") {
    return (
      <p className="max-w-2xl text-sm leading-6 text-zinc-600">
        Looking for public stories instead? Open the{" "}
        <Link
          href="/tiktok-story-viewer"
          className="font-medium text-teal-800 underline"
        >
          TikTok Story Viewer
        </Link>{" "}
        to watch them anonymously.
      </p>
    );
  }

  return (
    <p className="max-w-2xl text-sm leading-6 text-zinc-600">
      Need User ID, region, or other public profile fields? Use the{" "}
      <Link href="/" className="font-medium text-teal-800 underline">
        TikTok User Finder
      </Link>
      .
    </p>
  );
}
