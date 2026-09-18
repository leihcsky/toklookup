import { lookupPublicStories } from "../lib/tiktok/stories-provider";

const accounts = ["tiktok", "mrbeast", "khaby.lame"];

async function main() {
  for (const username of accounts) {
    const started = Date.now();
    const lookup = await lookupPublicStories(username);
    const result = lookup.result;
    const ms = Date.now() - started;
    const extra =
      result.status === "success"
        ? `${result.profile.username} stories=${result.stories.length}`
        : result.profile
          ? `${result.profile.username} ${result.status}`
          : result.status;
    console.log(`${username.padEnd(20)} ${result.status.padEnd(14)} ${ms}ms ${extra}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
