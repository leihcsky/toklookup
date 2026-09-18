const USERNAME_PATTERN = /^[A-Za-z0-9._]{2,24}$/;

export function normalizeUsername(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  let candidate = extractFromUrl(trimmed) ?? trimmed;
  candidate = candidate.replace(/^@+/, "").trim();
  candidate = candidate.split(/[/?#]/)[0]?.trim() ?? "";

  if (!USERNAME_PATTERN.test(candidate)) {
    return null;
  }

  return candidate;
}

function extractFromUrl(value: string): string | null {
  const withProtocol = /^https?:\/\//i.test(value) ? value : "";
  const maybeUrl = withProtocol || (/tiktok\.com\//i.test(value) ? `https://${value}` : "");

  if (!maybeUrl) {
    return null;
  }

  try {
    const url = new URL(maybeUrl);
    if (!/(^|\.)tiktok\.com$/i.test(url.hostname)) {
      return null;
    }

    const match = url.pathname.match(/\/@([^/]+)/);
    if (!match?.[1]) {
      return null;
    }

    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
