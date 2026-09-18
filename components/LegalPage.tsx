import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col px-4 py-8 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-lg leading-8 text-zinc-600">{description}</p>
      ) : null}
      <div className="legal-copy mt-10 space-y-8 text-[15px] leading-7 text-zinc-700">
        {children}
      </div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h2>
      {children}
    </section>
  );
}