import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseStoryList } from "../lib/tiktok/stories-parser";

const fixturePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "story-list.json",
);
const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));
const now = 1_758_193_200_000 + 60 * 60 * 1000;

describe("parseStoryList", () => {
  it("extracts a public video story with playable media", () => {
    const stories = parseStoryList(fixture, now);
    assert.equal(stories.length, 1);
    assert.equal(stories[0]?.id, "7572198435487501598");
    assert.equal(stories[0]?.type, "video");
    assert.equal(
      stories[0]?.mediaUrl,
      "https://v16-webapp-prime.tiktok.com/video/tos/example.mp4",
    );
    assert.equal(stories[0]?.durationSeconds, 8);
  });

  it("returns an empty list when there are no active items", () => {
    assert.deepEqual(parseStoryList({ statusCode: 0, itemList: [] }, now), []);
  });

  it("drops expired stories", () => {
    const stories = parseStoryList(
      {
        itemList: [
          {
            id: "old",
            createTime: 1_700_000_000,
            video: {
              playAddr: "https://v16-webapp-prime.tiktok.com/video/old.mp4",
            },
          },
        ],
      },
      now,
    );
    assert.equal(stories.length, 0);
  });

  it("keeps media on the outer item when a nested story object exists", () => {
    const stories = parseStoryList(
      {
        itemList: [
          {
            id: "outer-id",
            createTime: 1_758_193_200,
            story: { viewed: false },
            video: {
              duration: 8,
              playAddr: "https://v16-webapp-prime.tiktok.com/video/tos/example.mp4",
              originCover: "https://p16-sign.tiktokcdn.com/tos-maliva-p-0068/cover.jpeg",
            },
          },
        ],
      },
      now,
    );
    assert.equal(stories.length, 1);
    assert.equal(stories[0]?.id, "outer-id");
    assert.equal(
      stories[0]?.mediaUrl,
      "https://v16-webapp-prime.tiktok.com/video/tos/example.mp4",
    );
  });

  it("reads nested story objects", () => {
    const stories = parseStoryList(
      {
        itemList: {
          "0": {
            story: {
              id: "photo-1",
              createTime: 1_758_193_200,
              imagePost: {
                images: [{ imageURL: "https://p16-sign.tiktokcdn.com/tos/photo.jpg" }],
              },
            },
          },
        },
      },
      now,
    );
    assert.equal(stories.length, 1);
    assert.equal(stories[0]?.type, "photo");
    assert.equal(
      stories[0]?.mediaUrl,
      "https://p16-sign.tiktokcdn.com/tos/photo.jpg",
    );
  });
});
