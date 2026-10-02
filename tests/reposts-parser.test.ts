import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseRepostPage } from "../lib/tiktok/reposts-parser";

const videoItem = {
  id: "7691036284428635423",
  desc: "Skilled trades campaign ",
  createTime: 1_758_193_200,
  author: {
    uniqueId: "chris_sbrocco",
    nickname: "Chris",
    avatarThumb: "https://p16-common-sign.tiktokcdn-us.com/avatar.jpeg",
  },
  video: {
    cover: "https://p19-common-sign.tiktokcdn-us.com/tos-useast8/cover.jpeg",
    playAddr: "https://v16-webapp-prime.us.tiktok.com/video/tos/useast8/play.mp4",
    duration: 15,
  },
  stats: { playCount: 865, diggCount: 12 },
};

describe("parseRepostPage", () => {
  it("normalizes a reposted video with author and TikTok link", () => {
    const page = parseRepostPage({ statusCode: 0, itemList: [videoItem], hasMore: true, cursor: 30 });
    assert.equal(page.reposts.length, 1);
    assert.equal(page.hasMore, true);
    assert.equal(page.cursor, "30");

    const [repost] = page.reposts;
    assert.equal(repost?.author?.username, "chris_sbrocco");
    assert.equal(repost?.description, "Skilled trades campaign");
    assert.equal(repost?.playCount, 865);
    assert.equal(repost?.type, "video");
    assert.equal(
      repost?.videoUrl,
      "https://www.tiktok.com/@chris_sbrocco/video/7691036284428635423",
    );
    assert.equal(repost?.playUrl, videoItem.video.playAddr);
    assert.equal(repost?.playable, true);
  });

  it("collects photo post images and has no video play URL", () => {
    const page = parseRepostPage({
      itemList: [
        {
          ...videoItem,
          id: "9",
          imagePost: {
            cover: { imageURL: { urlList: ["https://p16-sign.tiktokcdn-us.com/photo-cover.jpeg"] } },
            images: [
              { imageURL: { urlList: ["https://p16-sign.tiktokcdn-us.com/photo-1.jpeg"] } },
              { imageURL: { urlList: ["https://p16-sign.tiktokcdn-us.com/photo-2.jpeg"] } },
            ],
          },
        },
      ],
    });
    const [photo] = page.reposts;
    assert.equal(photo?.type, "photo");
    assert.equal(photo?.images.length, 2);
    assert.equal(photo?.playUrl, null);
    assert.equal(photo?.playable, true);
    assert.equal(photo?.videoUrl, "https://www.tiktok.com/@chris_sbrocco/photo/9");
  });

  it("prefers statsV2 string counts", () => {
    const page = parseRepostPage({
      itemList: [{ ...videoItem, statsV2: { playCount: "19700000", diggCount: "61100" } }],
    });
    assert.equal(page.reposts[0]?.playCount, 19_700_000);
    assert.equal(page.reposts[0]?.likeCount, 61_100);
  });

  it("drops private and duplicate items but keeps promoted reposts", () => {
    const page = parseRepostPage({
      itemList: [
        videoItem,
        videoItem,
        { ...videoItem, id: "2", privateItem: true },
        { ...videoItem, id: "3", isAd: true },
      ],
      hasMore: false,
    });
    assert.deepEqual(
      page.reposts.map((item) => item.id),
      ["7691036284428635423", "3"],
    );
    assert.equal(page.cursor, null);
  });

  it("returns an empty page when there is no item list", () => {
    assert.deepEqual(parseRepostPage({ statusCode: 0 }), {
      reposts: [],
      hasMore: false,
      cursor: null,
    });
  });
});
