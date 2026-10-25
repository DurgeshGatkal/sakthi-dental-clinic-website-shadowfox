/*
 * Section 14 — image pipeline.
 *
 *   node scripts/optimize-images.mjs
 *
 * Converts every used source photo to AVIF and WebP at 480, 960 and 1600 px,
 * derives the 1200 x 630 share image and the favicons from the approved logo,
 * and skips any output that is already newer than its source.
 *
 * Outputs are build artefacts: client/public/images/_optimized/, og-image.jpg
 * and the icon files are all git-ignored. Dev and build run this first.
 */
import { existsSync, statSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "..", "client", "public");
const imagesDir = join(publicDir, "images");
const outDir = join(imagesDir, "_optimized");

const WIDTHS = [480, 960, 1600];
const LOGO_WIDTHS = [160, 320, 480];
const SOURCE_FOLDERS = ["photos", "banners"];
const IGNORED_SOURCES = [/banner-2\.jpg$/i, /banner-3\.jpg$/i]; // unused originals
const LOGO = join(imagesDir, "logo", "sdc-logo.png");

const isFresh = (out, source) =>
  existsSync(out) && statSync(out).mtimeMs >= statSync(source).mtimeMs;

async function collectSources() {
  const sources = [];
  for (const folder of SOURCE_FOLDERS) {
    const files = await readdir(join(imagesDir, folder));
    for (const file of files) {
      if (!/\.(jpe?g|png)$/i.test(file)) continue;
      const source = join("images", folder, file);
      if (IGNORED_SOURCES.some((pattern) => pattern.test(source))) continue;
      sources.push(source);
    }
  }
  sources.push(join("images", "logo", "sdc-logo.png"));
  return sources;
}

async function buildVariants() {
  let built = 0;
  let skipped = 0;

  for (const source of await collectSources()) {
    const absolute = join(publicDir, source);
    const { width: sourceWidth } = await sharp(absolute).metadata();
    const isLogo = source.endsWith("sdc-logo.png");
    const widths = isLogo ? LOGO_WIDTHS : WIDTHS;
    const stem = source.replace(/^images[\\/]/, "").replace(/\.(jpe?g|png)$/i, "");

    for (const width of widths) {
      /* Never upscale: a 1600 px slot still gets a real file, just not a fake one. */
      const target = Math.min(width, sourceWidth ?? width);

      for (const format of ["avif", "webp"]) {
        const out = join(outDir, `${stem}-${width}.${format}`);
        if (isFresh(out, absolute)) {
          skipped += 1;
          continue;
        }

        await mkdir(dirname(out), { recursive: true });
        const resized = sharp(absolute).resize({ width: target, withoutEnlargement: true });
        const encoded =
          format === "avif"
            ? resized.avif({ quality: isLogo ? 70 : 52, effort: 4 })
            : resized.webp({ quality: isLogo ? 80 : 74, effort: 5 });

        await encoded.toFile(out);
        built += 1;
      }
    }
  }

  return { built, skipped };
}

async function buildShareImage() {
  const out = join(publicDir, "og-image.jpg");
  const hero = join(imagesDir, "photos", "hero-dentist-child.jpg");
  if (isFresh(out, hero) && isFresh(out, LOGO)) return false;

  const width = 1200;
  const height = 630;
  const photo = await sharp(hero)
    .resize(width, height, { fit: "cover", position: "attention" })
    .toBuffer();

  const logoWidth = 250;
  const pad = 28;
  const plateWidth = logoWidth + pad * 2;
  const logoHeight = Math.round((logoWidth * 313) / 694);
  const plateHeight = logoHeight + pad * 2;

  const plate = Buffer.from(
    `<svg width="${plateWidth}" height="${plateHeight}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect width="${plateWidth}" height="${plateHeight}" rx="20" fill="#ffffff" fill-opacity="0.95"/>` +
      `</svg>`,
  );
  const logo = await sharp(LOGO).resize({ width: logoWidth }).png().toBuffer();

  await sharp(photo)
    .composite([
      { input: plate, left: 44, top: height - plateHeight - 44 },
      { input: logo, left: 44 + pad, top: height - plateHeight - 44 + pad },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);

  return true;
}

/* Wrap a 32 x 32 PNG in a one-image ICO so /favicon.ico is a real file. */
function pngToIco(png) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = 32;
  header[7] = 32;
  header[8] = 0;
  header[9] = 0;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

async function buildIcons() {
  const out = join(publicDir, "icon-32.png");
  if (isFresh(out, LOGO)) return false;

  /* The blue tooth mark occupies x 5-277, y 13-285 of the 694 x 313 wordmark
   * (measured from the pixels, so the red "SAKTHI" never bleeds into the icon). */
  const tooth = await sharp(LOGO).extract({ left: 5, top: 13, width: 273, height: 273 }).toBuffer();

  const icons = [
    { name: "icon-32.png", size: 32 },
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "apple-touch-icon.png", size: 180 },
  ];

  for (const { name, size } of icons) {
    const inset = Math.round(size * 0.08);
    const inner = size - inset * 2;
    const mark = await sharp(tooth)
      .resize({ width: inner, height: inner, fit: "contain", background: "#ffffff" })
      .toBuffer();

    await sharp({
      create: { width: size, height: size, channels: 4, background: "#ffffff" },
    })
      .composite([{ input: mark, left: inset, top: inset }])
      .png()
      .toFile(join(publicDir, name));
  }

  await writeFile(
    join(publicDir, "favicon.ico"),
    pngToIco(await readFile(join(publicDir, "icon-32.png"))),
  );

  return true;
}

const { built, skipped } = await buildVariants();
const shareBuilt = await buildShareImage();
const iconsBuilt = await buildIcons();

console.log(
  `images: ${built} variants built, ${skipped} fresh, share image ${shareBuilt ? "built" : "fresh"}, icons ${iconsBuilt ? "built" : "fresh"}`,
);
