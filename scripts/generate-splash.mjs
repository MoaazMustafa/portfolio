/**
 * generate-splash.mjs
 * Generates iOS PWA splash screen PNGs: dark background (#000) + centred icon.
 *
 * Usage:  node scripts/generate-splash.mjs
 * Requires: sharp (bundled by Next.js — no extra install needed)
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ICON_SRC = path.join(
  ROOT,
  'public',
  'favicon',
  'android-chrome-512x512.png',
);
const OUT_DIR = path.join(ROOT, 'public', 'splash');

/** All iOS device splash screen sizes (portrait) */
const SIZES = [
  // iPhone SE 1st gen
  { w: 640, h: 1136, name: 'apple-splash-640-1136' },
  // iPhone 8 / SE 2nd gen
  { w: 750, h: 1334, name: 'apple-splash-750-1334' },
  // iPhone 8 Plus
  { w: 1242, h: 2208, name: 'apple-splash-1242-2208' },
  // iPhone X / XS / 11 Pro / 12 mini
  { w: 1125, h: 2436, name: 'apple-splash-1125-2436' },
  // iPhone XS Max / 11 Pro Max
  { w: 1242, h: 2688, name: 'apple-splash-1242-2688' },
  // iPhone XR / 11
  { w: 828, h: 1792, name: 'apple-splash-828-1792' },
  // iPhone 12 mini
  { w: 1080, h: 2340, name: 'apple-splash-1080-2340' },
  // iPhone 12 / 13 / 14
  { w: 1170, h: 2532, name: 'apple-splash-1170-2532' },
  // iPhone 12 / 13 Pro Max
  { w: 1284, h: 2778, name: 'apple-splash-1284-2778' },
  // iPhone 14 Pro / 15 / 15 Pro
  { w: 1179, h: 2556, name: 'apple-splash-1179-2556' },
  // iPhone 14 Pro Max / 15 Plus / 15 Pro Max
  { w: 1290, h: 2796, name: 'apple-splash-1290-2796' },
  // iPad mini / Air (7.9" & 10.5")
  { w: 1536, h: 2048, name: 'apple-splash-1536-2048' },
  // iPad Pro 11"
  { w: 1668, h: 2388, name: 'apple-splash-1668-2388' },
  // iPad Pro 12.9"
  { w: 2048, h: 2732, name: 'apple-splash-2048-2732' },
];

/** Icon occupies 33% of the shorter dimension, centred */
async function generate() {
  if (!fs.existsSync(ICON_SRC)) {
    console.error(`Icon not found: ${ICON_SRC}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const iconBuffer = fs.readFileSync(ICON_SRC);

  for (const { w, h, name } of SIZES) {
    const iconSize = Math.round(Math.min(w, h) * 0.33);
    const left = Math.round((w - iconSize) / 2);
    const top = Math.round((h - iconSize) / 2);

    const resizedIcon = await sharp(iconBuffer)
      .resize(iconSize, iconSize)
      .toBuffer();

    await sharp({
      create: {
        width: w,
        height: h,
        radius: 10,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }, // #000000
      },
    })
      .composite([{ input: resizedIcon, left, top }])
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT_DIR, `${name}.png`));

    console.log(`✓  ${name}.png  (${w}×${h})`);
  }

  console.log(
    `\nSplash screens written to public/splash/ (${SIZES.length} files)`,
  );
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
