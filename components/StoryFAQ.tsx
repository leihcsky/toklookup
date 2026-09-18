export const STORY_FAQS = [
  {
    question: "Do I need a TikTok account to use this Story Viewer?",
    answer:
      "No. Paste a public username, @handle, or profile URL. You watch here without signing in, so the lookup is not tied to a TikTok account of yours.",
  },
  {
    question: "Can I watch public TikTok stories anonymously?",
    answer:
      "Yes. This Story Viewer does not ask you to log in. You preview currently active public stories in the browser without using your TikTok username. Private, Friends, and expired stories stay unavailable.",
  },
  {
    question: "Can I view private TikTok stories?",
    answer:
      "No. Only currently active stories from public accounts are shown. Private accounts, Friends stories, and expired stories stay unavailable.",
  },
  {
    question: "Why didn't any stories appear?",
    answer:
      "The username may be wrong, the account may be private, there may be no active public story, or stories from the last 24 hours may have already expired. TokLookup does not guess or fill those gaps.",
  },
  {
    question: "Can I download a public TikTok story?",
    answer:
      "Yes, when this page returns a currently active public story. Download only stories you have a right to save. This is not a general TikTok video downloader.",
  },
  {
    question: "Will the creator see that I watched their story?",
    answer:
      "You watch anonymously on this page: there is no TikTok login, so the lookup does not use your TikTok username. TikTok still controls what creators see in the app, and that can change. We do not promise that a view is invisible.",
  },
  {
    question: "How is this different from the TikTok User Finder?",
    answer:
      "The User Finder shows public profile fields such as User ID, region, and follower counts. Open it from the header, the footer, or the link above the search box. This Story Viewer looks up currently active public stories so you can preview or download them anonymously.",
  },
];

export function StoryFAQ() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
        Common questions
      </h2>
      <div className="divide-y divide-zinc-200 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        {STORY_FAQS.map((item) => (
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
