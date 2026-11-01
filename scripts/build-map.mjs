/*
 * Build a static contact map from OpenStreetMap tiles.
 * Run once; the output is committed so the page has no runtime tile dependency.
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const Z = 15;
const LAT = 12.7409;
const LON = 77.8253;
const n = 2 ** Z;
const x = Math.floor(((LON + 180) / 360) * n);
const latRad = (LAT * Math.PI) / 180;
const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);

const cols = 3;
const rows = 2;
const startX = x - 1;
const startY = y - 1;

const tiles = [];
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const tx = startX + col;
    const ty = startY + row;
    const url = `https://tile.openstreetmap.org/${Z}/${tx}/${ty}.png`;
    const res = await fetch(url, {
      headers: { "User-Agent": "sakthi-dental-clinic-website/1.0 (build script)" },
    });
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    tiles.push({ input: buf, left: col * 256, top: row * 256 });
  }
}

await mkdir("client/public/images/contact", { recursive: true });

// Stitch the tiles first, then place the pin in the resized coordinate space.
const stitched = await sharp({
  create: {
    width: cols * 256,
    height: rows * 256,
    channels: 3,
    background: "#e8edf5",
  },
})
  .composite(tiles)
  .png()
  .toBuffer();

const W = 720;
const H = 400;
const scale = Math.max(W / (cols * 256), H / (rows * 256));
const markerX = ((x - startX) * 256 + 128) * scale - (cols * 256 * scale - W) / 2;
const markerY = ((y - startY) * 256 + 128) * scale - (rows * 256 * scale - H) / 2;

const pin = Buffer.from(
  `<svg width="44" height="44" xmlns="http://www.w3.org/2000/svg">
     <circle cx="22" cy="22" r="18" fill="#9a7b1a" opacity="0.22"/>
     <circle cx="22" cy="22" r="8" fill="#9a7b1a" stroke="#fff" stroke-width="3"/>
   </svg>`,
);

await sharp(stitched)
  .resize(W, H, { fit: "cover", position: "center" })
  .composite([{ input: pin, left: Math.round(markerX - 22), top: Math.round(markerY - 22) }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("client/public/images/contact/clinic-map.jpg");

await writeFile(
  "client/public/images/contact/ATTRIBUTION.txt",
  "Map data © OpenStreetMap contributors, available under the Open Database License (ODbL).\nTiles fetched from tile.openstreetmap.org at zoom 15.\n",
);

console.log(`map written for tile ${Z}/${x}/${y}`);
