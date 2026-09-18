export function formatCount(value: number | null): string {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatExactCount(value: number | null): string {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

export function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds <= 0) {
    return "—";
  }

  const rounded = Math.round(seconds);
  if (rounded < 60) {
    return `${rounded}s`;
  }

  const minutes = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
}

export function formatLanguage(code: string | null): string {
  if (!code) {
    return "—";
  }

  try {
    const name = new Intl.DisplayNames(["en"], { type: "language" }).of(code);
    return name ? `${name} (${code})` : code;
  } catch {
    return code;
  }
}

export function formatRegion(code: string | null): string {
  if (!code) {
    return "—";
  }

  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    return code;
  }

  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(normalized);
    return name && name !== normalized ? `${name} (${normalized})` : normalized;
  } catch {
    return code;
  }
}
