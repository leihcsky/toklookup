import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 text-sm text-zinc-600 sm:flex-row sm:items-start sm:justify-between sm:py-8">
        <div className="flex max-w-xl flex-col gap-2">
          <p className="leading-6">
            TokLookup is an independent third-party service and is not affiliated
            with, endorsed by, or sponsored by TikTok or ByteDance. It only
            attempts to retrieve publicly available profile information and
            currently active public stories.
          </p>
          <p className="text-zinc-500">© {new Date().getFullYear()} TokLookup</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/" className="py-1 hover:text-zinc-900">
            User Finder
          </Link>
          <Link href="/tiktok-story-viewer" className="py-1 hover:text-zinc-900">
            Story Viewer
          </Link>
          <Link href="/terms" className="py-1 hover:text-zinc-900">
            Terms
          </Link>
          <Link href="/privacy" className="py-1 hover:text-zinc-900">
            Privacy
          </Link>
          <Link href="/data-removal" className="py-1 hover:text-zinc-900">
            Data Removal
          </Link>
          <Link href="/contact" className="py-1 hover:text-zinc-900">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
