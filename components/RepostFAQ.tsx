export const REPOST_FAQS = [
  {
    question: "What is a TikTok repost viewer?",
    answer:
      "It is a tool that lists the videos an account has reposted on TikTok, the same ones that appear on its Reposts tab. TokLookup's version runs in your browser, so you can browse and watch public reposts without opening the app or logging in.",
  },
  {
    question: "How do I see someone's reposts on TikTok?",
    answer:
      "Paste their public username, @handle, or profile URL and tap View Reposts. TokLookup lists the videos that account has reposted, newest first, as far as TikTok makes them public.",
  },
  {
    question: "Do I need to log in to use this Repost Viewer?",
    answer:
      "No. You browse public reposts here without a TikTok login, so the lookup is not tied to a TikTok account of yours.",
  },
  {
    question: "Why can't I see any reposts?",
    answer:
      "The account may not have reposted anything, it may have hidden its Reposts tab, or it may be private. The username may also be wrong. TokLookup does not guess or fill those gaps.",
  },
  {
    question: "Can I see reposts from a private account?",
    answer:
      "No. Private accounts and hidden Reposts tabs stay closed. Only reposts TikTok already shows publicly are listed.",
  },
  {
    question: "Can I watch reposted videos without leaving this page?",
    answer:
      "Yes. Tap a cover to open it in a vertical player, and use the arrows or your keyboard to move through the list. Photo posts open as a swipeable set of images. Each repost also has an Open on TikTok button that goes to the original creator's post.",
  },
  {
    question: "Why does Load more stop?",
    answer:
      "TikTok returns reposts in pages. When there are no more public pages for that account, the list ends. Very old reposts may not be returned.",
  },
];

export function RepostFAQ() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
        TikTok Repost Viewer FAQ
      </h2>
      <div className="divide-y divide-zinc-200 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        {REPOST_FAQS.map((item) => (
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
