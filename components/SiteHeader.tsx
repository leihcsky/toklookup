import { Logo } from "@/components/BrandMark";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-3 sm:py-4">
        <Link href="/" aria-label="TokLookup home" className="hover:opacity-90">
          <Logo />
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-zinc-600">
          <Link href="/" className="py-1 hover:text-zinc-900">
            User Finder
          </Link>
          <Link href="/tiktok-story-viewer" className="py-1 hover:text-zinc-900">
            Story Viewer
          </Link>
        </nav>
      </div>
    </header>
  );
}
