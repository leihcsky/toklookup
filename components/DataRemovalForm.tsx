"use client";

import { SITE } from "@/lib/brand";
import { useState, type FormEvent } from "react";

export function DataRemovalForm() {
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `Data removal request: ${username.trim() || "TikTok profile"}`;
    const body = [
      "TikTok username:",
      username.trim() || "(not provided)",
      "",
      "Profile URL:",
      profileUrl.trim() || "(not provided)",
      "",
      "Reason:",
      reason.trim(),
      "",
      "Contact email:",
      email.trim(),
    ].join("\n");

    window.location.href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const fieldClass =
    "mt-1 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10";

  return (
    <form className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-zinc-800">
        TikTok username
        <input
          className={fieldClass}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="@username"
          autoComplete="off"
        />
      </label>
      <label className="block text-sm font-medium text-zinc-800">
        Profile URL
        <input
          className={fieldClass}
          type="url"
          value={profileUrl}
          onChange={(event) => setProfileUrl(event.target.value)}
          placeholder="https://www.tiktok.com/@username"
        />
      </label>
      <label className="block text-sm font-medium text-zinc-800">
        Reason
        <textarea
          className={`${fieldClass} min-h-28`}
          required
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Why should this information be removed or corrected?"
        />
      </label>
      <label className="block text-sm font-medium text-zinc-800">
        Contact email
        <input
          className={fieldClass}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </label>
      <button
        type="submit"
        className="h-12 rounded-2xl bg-teal-800 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
      >
        Email removal request
      </button>
      {sent ? (
        <p className="text-sm leading-6 text-zinc-600">
          Your email app should open with a prefilled message to {SITE.contactEmail}.
          If it does not, send the same details to that address directly. Requests are
          reviewed manually.
        </p>
      ) : null}
    </form>
  );
}