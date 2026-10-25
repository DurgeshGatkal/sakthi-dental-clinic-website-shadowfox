/*
 * Section 14 — every photo is served from the sharp pipeline as AVIF and WebP
 * at three widths. The original JPEG stays as the `<img>` fallback.
 */
export const IMAGE_WIDTHS = [480, 960, 1600] as const;
export const LOGO_WIDTHS = [160, 320, 480] as const;

/* The hero and every treatment image share the same two-column slot. */
export const HERO_SIZES = "(min-width: 1024px) 600px, 100vw";
export const IMAGE_SIZES = "(min-width: 1024px) 600px, 100vw";

export type ImageFormat = "avif" | "webp";

export function optimizedSrc(src: string, width: number, format: ImageFormat) {
  return src
    .replace("/images/", "/images/_optimized/")
    .replace(/\.(jpe?g|png)$/i, `-${width}.${format}`);
}

export function imageSrcSet(
  src: string,
  format: ImageFormat,
  widths: readonly number[] = IMAGE_WIDTHS,
) {
  return widths.map((width) => `${optimizedSrc(src, width, format)} ${width}w`).join(", ");
}
