import { fetchPublicProfile } from "../lib/tiktok/public-page-provider";

const accounts = [
  "tiktok",
  "mrbeast",
  "khaby.lame",
  "maedepreciva",
  "nouserabcxyz99",
];

async function main() {
  for (const username of accounts) {
    const started = Date.now();
    const result = await fetchPublicProfile(username);
    const ms = Date.now() - started;
    const extra =
      result.status === "success"
        ? `${result.profile.username} id=${result.profile.userId} lang=${result.profile.language} bioLink=${result.profile.bioLink ? "yes" : "no"} created=${result.profile.createdAt}`
        : result.profile
          ? result.profile.username
          : "";
    console.log(`${username.padEnd(32)} ${result.status.padEnd(14)} ${ms}ms ${extra}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
