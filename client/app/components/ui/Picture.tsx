import { IMAGE_WIDTHS, imageSrcSet } from "~/lib/images";

type PictureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Matches the rendered slot, so mobile never downloads a desktop file. */
  sizes: string;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  widths?: readonly number[];
};

/*
 * Section 14 — AVIF first, WebP second, the original JPEG as the last resort.
 * `display: contents` lets the <img> keep its place in the grid or as an
 * absolutely positioned banner layer.
 */
export function Picture({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  loading = "lazy",
  fetchPriority,
  widths = IMAGE_WIDTHS,
}: PictureProps) {
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={imageSrcSet(src, "avif", widths)} sizes={sizes} />
      <source type="image/webp" srcSet={imageSrcSet(src, "webp", widths)} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={loading === "eager" ? "sync" : "async"}
        className={className}
      />
    </picture>
  );
}
