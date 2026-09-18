import { Logo } from "@/components/BrandMark";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center px-4 py-3 sm:py-4">
        <Link href="/" aria-label="TokLookup home" className="hover:opacity-90">
          <Logo />
        </Link>
      </div>
    </header>
  );
}
