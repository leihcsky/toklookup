import { normalizeProfile, statsFromDetail } from "./normalizer";
import type { LookupResult, RawTikTokStats, RawTikTokUser, RawUserDetail } from "./types";

const REHYDRATION_SCRIPT_ID = "__UNIVERSAL_DATA_FOR_REHYDRATION__";
const SIGI_SCRIPT_ID = "SIGI_STATE";
const USER_DETAIL_KEY = "webapp.user-detail";
const NOT_FOUND_STATUS_CODES = new Set([10202, 10221]);

export function parseProfileHtml(html: string): LookupResult {
  if (!html.trim()) {
    return { status: "parse_error" };
  }

  const rehydration = extractScriptJson(html, REHYDRATION_SCRIPT_ID);
  const userDetail = extractUserDetail(rehydration) ?? extractUserDetailFallback(html);

  if (userDetail) {
    return classifyUserDetail(userDetail);
  }

  const sigi = extractScriptJson(html, SIGI_SCRIPT_ID);
  const fromSigi = parseSigiState(sigi);
  if (fromSigi) {
    return fromSigi;
  }

  if (looksLikeInterstitial(html)) {
    return { status: "unavailable" };
  }

  return { status: "parse_error" };
}

export function extractScriptJson(html: string, scriptId: string): unknown | null {
  const patterns = [`id="${scriptId}"`, `id='${scriptId}'`];
  let marker = -1;

  for (const pattern of patterns) {
    marker = html.indexOf(pattern);
    if (marker >= 0) {
      break;
    }
  }

  if (marker < 0) {
    return null;
  }

  const openTagEnd = html.indexOf(">", marker);
  if (openTagEnd < 0) {
    return null;
  }

  const closeTag = html.indexOf("</script>", openTagEnd);
  if (closeTag < 0) {
    return null;
  }

  const raw = html.slice(openTagEnd + 1, closeTag).trim();
  return parseJson(raw);
}

export function extractUserDetail(data: unknown): RawUserDetail | null {
  if (!isRecord(data)) {
    return null;
  }

  const scope = isRecord(data.__DEFAULT_SCOPE__) ? data.__DEFAULT_SCOPE__ : data;
  const detail = scope[USER_DETAIL_KEY];
  return isRecord(detail) ? (detail as RawUserDetail) : null;
}

function extractUserDetailFallback(html: string): RawUserDetail | null {
  const key = `"${USER_DETAIL_KEY}"`;
  const keyIndex = html.indexOf(key);
  if (keyIndex < 0) {
    return null;
  }

  const objectStart = html.indexOf("{", keyIndex + key.length);
  if (objectStart < 0) {
    return null;
  }

  const json = sliceJsonObject(html, objectStart);
  if (!json) {
    return null;
  }

  const parsed = parseJson(json);
  return isRecord(parsed) ? (parsed as RawUserDetail) : null;
}

function classifyUserDetail(detail: RawUserDetail): LookupResult {
  const statusCode = toStatusCode(detail.statusCode);
  const user = detail.userInfo?.user;
  const stats = statsFromDetail(detail);
  const profile = user ? normalizeProfile(user, stats) : null;

  if (profile) {
    if (user?.privateAccount === true) {
      return { status: "private", profile };
    }
    return { status: "success", profile };
  }

  if (statusCode !== null && NOT_FOUND_STATUS_CODES.has(statusCode)) {
    return { status: "not_found" };
  }

  if (statusCode !== null && statusCode !== 0) {
    return { status: "unavailable" };
  }

  return { status: "not_found" };
}

function parseSigiState(data: unknown): LookupResult | null {
  if (!isRecord(data)) {
    return null;
  }

  const userModule = isRecord(data.UserModule) ? data.UserModule : null;
  const users = isRecord(userModule?.users) ? userModule.users : null;
  const statsMap = isRecord(userModule?.stats) ? userModule.stats : null;

  if (!users) {
    return null;
  }

  const firstKey = Object.keys(users)[0];
  if (!firstKey || !isRecord(users[firstKey])) {
    return { status: "not_found" };
  }

  const user = users[firstKey] as RawTikTokUser;
  const stats =
    firstKey && isRecord(statsMap?.[firstKey])
      ? (statsMap[firstKey] as RawTikTokStats)
      : undefined;
  const profile = normalizeProfile(user, stats);

  if (!profile) {
    return { status: "parse_error" };
  }

  if (user.privateAccount === true) {
    return { status: "private", profile };
  }

  return { status: "success", profile };
}

function looksLikeInterstitial(html: string): boolean {
  return (
    /captcha/i.test(html) ||
    /verify.*tiktok/i.test(html) ||
    /Access Denied/i.test(html)
  );
}

function parseJson(raw: string): unknown | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function sliceJsonObject(source: string, start: number): string | null {
  if (source[start] !== "{") {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < source.length; i += 1) {
    const char = source[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, i + 1);
      }
    }
  }

  return null;
}

function toStatusCode(value: number | string | undefined): number | null {
  if (value === undefined || value === "") {
    return null;
  }
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
