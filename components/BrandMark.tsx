import { BRAND } from "@/lib/brand";

type BrandMarkProps = {
  className?: string;
  title?: string;
};

export function BrandMark({ className, title }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect width="32" height="32" rx="8" fill={BRAND.teal} />
      <rect x="8.2" y="8.5" width="15.6" height="3.4" rx="1.7" fill="#fff" />
      <rect x="14.3" y="8.5" width="3.4" height="8.2" fill="#fff" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M10.1 20.7a5.9 5.9 0 1 0 11.8 0 5.9 5.9 0 1 0-11.8 0Zm3.3 0a2.6 2.6 0 1 0 5.2 0 2.6 2.6 0 1 0-5.2 0Z"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <BrandMark className="h-8 w-8 shrink-0" />
      <span className="text-lg font-semibold tracking-tight text-zinc-900">
        Tok<span className="text-teal-800">Lookup</span>
      </span>
    </span>
  );
}
