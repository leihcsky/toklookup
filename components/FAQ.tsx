export const FAQS = [
  {
    question: "How do I look up a TikTok user?",
    answer:
      "Paste a username (mrbeast), an @handle (@mrbeast), or a public profile URL such as https://www.tiktok.com/@mrbeast, then tap Find User. You do not need to open TikTok.",
  },
  {
    question: "Where does the profile data come from?",
    answer:
      "TokLookup reads the public TikTok profile page for that username and shows fields that page already exposes, such as bio, follower counts, and User ID. It does not log in to TikTok, and it does not collect data from private profiles.",
  },
  {
    question: "Do I need to log in?",
    answer:
      "No. TokLookup does not ask for a TikTok account, email, or app install. The lookup runs on this page.",
  },
  {
    question: "What is a TikTok User ID?",
    answer:
      "The User ID is TikTok's numeric identifier for the account. A username can change; the User ID does not. If someone renamed @oldname to @newname, the User ID is still the same account.",
  },
  {
    question: "Why didn't a lookup work?",
    answer:
      "The username may be wrong, the profile may be private, or TikTok's public page may be temporarily unavailable. TokLookup does not treat those cases as the same thing, and it will not guess.",
  },
  {
    question: "Can I look up a private account?",
    answer:
      "No. Only information that is already public on the web profile is shown. Private accounts are not opened.",
  },
  {
    question: "Why is some information missing?",
    answer:
      "Fields such as a bio link or region only appear when TikTok includes them on the public profile. If a field is blank, it was not available in that public data.",
  },
];

export function FAQ() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
        Common questions
      </h2>
      <div className="divide-y divide-zinc-200 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        {FAQS.map((item) => (
          <details key={item.question} className="group px-4 py-3 sm:px-5 sm:py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 py-1 text-zinc-900 [-webkit-tap-highlight-color:transparent] [&::-webkit-details-marker]:hidden">
              <h3 className="text-base font-medium leading-6">{item.question}</h3>
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-zinc-400 transition group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-2 pr-8 text-sm leading-6 text-zinc-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
