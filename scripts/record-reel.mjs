// Scripted screen-recording of the FZY Studio site.
//
// Drives a real Chromium through the page with smooth wheel-scroll (Lenis catches
// the wheel events wherever the cursor sits, including the case-study overlay's
// own Lenis instance), opens the Makeup by Roko case study, then records the whole
// run to video and transcodes it to MP4.
//
//   npm run record            # records localhost:3000 -> recordings/fzy-studio-reel.mp4
//   BASE_URL=... npm run record
//
// Requires the dev server (or a prod build) to already be serving BASE_URL.

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, rm, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const WIDTH = 1920;
const HEIGHT = 1080;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "recordings");
const rawDir = path.join(outDir, ".raw");
const mp4Path = path.join(outDir, "fzy-studio-reel.mp4");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** One smooth wheel nudge + settle, so Lenis can glide and whileInView fires. */
async function step(page, dy = 360, settle = 520) {
  await page.mouse.wheel(0, dy);
  await wait(settle);
}

/** Scroll the main window until predicate() is true (or we hit maxSteps). */
async function scrollUntil(page, predicate, { dy = 360, settle = 520, maxSteps = 60 } = {}) {
  for (let i = 0; i < maxSteps; i++) {
    if (await predicate()) return true;
    await step(page, dy, settle);
  }
  return false;
}

async function run() {
  await rm(rawDir, { recursive: true, force: true });
  await mkdir(rawDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--force-color-profile=srgb", "--hide-scrollbars"],
  });
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    recordVideo: { dir: rawDir, size: { width: WIDTH, height: HEIGHT } },
  });
  const page = await context.newPage();

  console.log(`→ opening ${BASE_URL}`);
  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 60_000 });
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  // Park the cursor in the canvas so the work-section eye/laser has something to track.
  await page.mouse.move(WIDTH * 0.6, HEIGHT * 0.5);

  // ── Hero: let the intro animation breathe ──
  await wait(3200);

  // ── Glide down through Statement → Selected Work, stopping at "View details" ──
  console.log("→ scrolling to Selected Work");
  const viewDetails = page.locator("#work button.work-outline");
  await scrollUntil(page, async () => {
    const box = await viewDetails.boundingBox().catch(() => null);
    return !!box && box.y > 0 && box.y < HEIGHT * 0.55;
  }, { dy: 340, settle: 560, maxSteps: 40 });
  await wait(900);

  // Sweep the cursor across the work preview so the eye/laser tracks it.
  await page.mouse.move(WIDTH * 0.78, HEIGHT * 0.42, { steps: 24 });
  await wait(700);
  await page.mouse.move(WIDTH * 0.4, HEIGHT * 0.55, { steps: 24 });
  await wait(900);

  // ── Open the Makeup by Roko case study ──
  console.log("→ opening case study");
  await viewDetails.scrollIntoViewIfNeeded().catch(() => {});
  await viewDetails.click();
  await wait(1800); // slide-up (0.6s) + settle

  // Keep the cursor over the overlay so its own Lenis catches the wheel.
  await page.mouse.move(WIDTH * 0.5, HEIGHT * 0.5);

  const overlayRemaining = () =>
    page.evaluate(() => {
      const el = document.querySelector(".no-scrollbar");
      if (!el) return 0;
      return el.scrollHeight - el.clientHeight - el.scrollTop;
    });

  await wait(1600); // hold on the live hero preview

  console.log("→ scrolling through case study");
  for (let i = 0; i < 50; i++) {
    if ((await overlayRemaining()) <= 8) break;
    await step(page, 420, 780);
    // Pause a touch longer early on so the DM-typing + calendar animations play out.
    if (i === 2 || i === 5 || i === 9) await wait(1600);
  }
  await wait(1600); // hold on the closing CTA

  // ── Close, then continue down the main page ──
  console.log("→ closing case study");
  await page.keyboard.press("Escape");
  await wait(1400);
  await page.mouse.move(WIDTH * 0.5, HEIGHT * 0.5);

  console.log("→ scrolling to footer");
  await scrollUntil(page, async () =>
    page.evaluate(() => window.innerHeight + window.scrollY >= document.body.scrollHeight - 4),
    { dy: 380, settle: 600, maxSteps: 40 }
  );
  await wait(2000); // hold on the contact / footer

  // ── Finalize the video ──
  const video = page.video();
  await context.close();
  await browser.close();

  const webmPath = await video.path();
  console.log(`→ raw capture: ${path.relative(root, webmPath)}`);

  await mkdir(outDir, { recursive: true });
  await transcode(webmPath, mp4Path);
  await rm(rawDir, { recursive: true, force: true });

  console.log(`\n✓ done → ${path.relative(root, mp4Path)}`);
}

function transcode(input, output) {
  console.log("→ transcoding to MP4 (h264)");
  return new Promise((resolve, reject) => {
    const ff = spawn(
      "ffmpeg",
      [
        "-y",
        "-i", input,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "18",
        "-preset", "slow",
        "-movflags", "+faststart",
        "-vf", "fps=30",
        output,
      ],
      { stdio: ["ignore", "ignore", "inherit"] }
    );
    ff.on("error", reject);
    ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
}

run().catch(async (err) => {
  console.error("\n✗ recording failed:", err);
  // Surface any partial capture so it isn't silently lost.
  try {
    const files = await readdir(rawDir);
    if (files.length) console.error("  partial raw files in:", path.relative(root, rawDir), files);
  } catch {}
  process.exit(1);
});
