"use client";

type SearchBoxProps = {
  value: string;
  loading: boolean;
  recentSearches: string[];
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSelectRecent: (username: string) => void;
  onRemoveRecent: (username: string) => void;
  onClearRecent: () => void;
};

export function SearchBox({
  value,
  loading,
  recentSearches,
  onChange,
  onSubmit,
  onSelectRecent,
  onRemoveRecent,
  onClearRecent,
}: SearchBoxProps) {
  return (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="tiktok-username" className="sr-only">
        TikTok username
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="tiktok-username"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="@username or profile URL"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          className="h-12 w-full min-w-0 flex-1 rounded-2xl border border-zinc-300 bg-white px-4 text-base text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10 sm:h-14 sm:px-5"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-12 shrink-0 rounded-2xl bg-teal-800 px-6 text-base font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:px-7"
        >
          {loading ? "Looking up…" : "Find User"}
        </button>
      </div>

      {recentSearches.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
            <span className="font-medium text-zinc-500">Recent searches</span>
            <button
              type="button"
              onClick={onClearRecent}
              className="font-medium text-zinc-500 hover:text-zinc-800"
            >
              Clear
            </button>
          </p>
          <ul className="flex flex-wrap gap-2">
            {recentSearches.map((username) => (
              <li key={username} className="max-w-full">
                <span className="inline-flex max-w-full items-center rounded-full border border-zinc-200 bg-white pl-3 text-sm text-zinc-800 shadow-sm">
                  <button
                    type="button"
                    onClick={() => onSelectRecent(username)}
                    disabled={loading}
                    className="min-w-0 truncate py-1.5 pr-1 hover:text-teal-800 disabled:opacity-60"
                  >
                    @{username}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveRecent(username)}
                    aria-label={`Remove @${username} from recent searches`}
                    className="rounded-full px-2.5 py-1.5 text-zinc-400 hover:text-zinc-700"
                  >
                    ×
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
}
