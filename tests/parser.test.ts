import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseProfileHtml } from "../lib/tiktok/parser";
import { normalizeUsername } from "../lib/tiktok/username";

const fixturePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "user-detail.json",
);
const fixtureJson = readFileSync(fixturePath, "utf8");

describe("normalizeUsername", () => {
  it("accepts username, @username, and profile URLs", () => {
    assert.equal(normalizeUsername("mrbeast"), "mrbeast");
    assert.equal(normalizeUsername("@mrbeast"), "mrbeast");
    assert.equal(
      normalizeUsername("https://www.tiktok.com/@mrbeast"),
      "mrbeast",
    );
    assert.equal(
      normalizeUsername("https://www.tiktok.com/@mrbeast?lang=en"),
      "mrbeast",
    );
  });

  it("rejects empty or invalid values", () => {
    assert.equal(normalizeUsername(""), null);
    assert.equal(normalizeUsername("ab"), "ab");
    assert.equal(normalizeUsername("not a user!"), null);
    assert.equal(normalizeUsername("https://example.com/@mrbeast"), null);
  });
});

describe("parseProfileHtml", () => {
  it("extracts core profile fields including user ID", () => {
    const html = wrapRehydration(fixtureJson);
    const result = parseProfileHtml(html);

    assert.equal(result.status, "success");
    assert.ok(result.profile);
    assert.equal(result.profile.userId, "107955");
    assert.equal(result.profile.username, "tiktok");
    assert.equal(result.profile.displayName, "TikTok");
    assert.equal(result.profile.verified, true);
    assert.equal(result.profile.followerCount, 95800000);
    assert.equal(result.profile.followingCount, 1);
    assert.equal(result.profile.likeCount, 464000000);
    assert.equal(result.profile.videoCount, 1503);
    assert.equal(result.profile.profileUrl, "https://www.tiktok.com/@tiktok");
    assert.equal(result.profile.bioLink, "https://www.tiktok.com");
    assert.equal(result.profile.language, "en");
    assert.equal(result.profile.createdAt, "2015-02-28T17:22:29.000Z");
    assert.equal(result.profile.usernameChangedAt, null);
    assert.equal(result.profile.nicknameChangedAt, "2021-12-03T19:26:40.000Z");
  });

  it("falls back to webapp.user-detail without the script id", () => {
    const result = parseProfileHtml(`<html>${fixtureJson}</html>`);
    assert.equal(result.status, "success");
    assert.equal(result.profile?.userId, "107955");
  });

  it("marks private accounts without treating them as missing", () => {
    const html = wrapRehydration(
      JSON.stringify({
        __DEFAULT_SCOPE__: {
          "webapp.user-detail": {
            statusCode: 0,
            userInfo: {
              user: {
                id: "123",
                uniqueId: "secretuser",
                nickname: "Secret",
                privateAccount: true,
                verified: false,
              },
              stats: { followerCount: 10, followingCount: 1, heartCount: 2, videoCount: 0 },
            },
          },
        },
      }),
    );

    const result = parseProfileHtml(html);
    assert.equal(result.status, "private");
    assert.equal(result.profile?.username, "secretuser");
  });

  it("returns not_found for known missing-user status codes", () => {
    const html = wrapRehydration(
      JSON.stringify({
        __DEFAULT_SCOPE__: {
          "webapp.user-detail": {
            statusCode: 10202,
            userInfo: {},
          },
        },
      }),
    );

    const result = parseProfileHtml(html);
    assert.equal(result.status, "not_found");
  });
});

function wrapRehydration(json: string): string {
  return `<!doctype html><html><head></head><body><script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">${json}</script></body></html>`;
}
