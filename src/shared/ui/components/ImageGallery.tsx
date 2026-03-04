"use client";

import { useState } from "react";

/**
 * Props for the ImageGallery client component.
 */
interface ImageGalleryProps {
  /** All product images — first is the default main image */
  images: readonly string[];
  /** Product name used as alt text */
  productName: string;
}

/**
 * Amazon-inspired image gallery with vertical thumbnails and a main image.
 *
 * Desktop: thumbnails stacked vertically on the left, main image on the right.
 * Mobile:  main image on top, horizontal thumbnail strip below.
 *
 * @remarks
 * Client component — manages selected-image state locally.
 * No external dependencies; uses only Tailwind 4 utilities.
 */
export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* ── Thumbnail strip ──────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:max-h-120">
        {images.map((src, index) => (
          <button
            key={`thumb-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`shrink-0 rounded-lg border-2 p-1 transition-all duration-150 ${
              index === selectedIndex
                ? "border-primary shadow-sm shadow-primary/20"
                : "border-border/40 hover:border-primary/50"
            }`}
            aria-label={`View image ${index + 1}`}
          >
            <img
              src={src}
              alt={`${productName} — view ${index + 1}`}
              className="h-14 w-14 object-contain sm:h-16 sm:w-16"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* ── Main image ───────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center rounded-xl border border-border/30 bg-white p-4 sm:p-8">
        <img
          src={mainImage}
          alt={productName}
          className="max-h-85 w-full object-contain sm:max-h-110 transition-opacity duration-200"
        />
      </div>
    </div>
  );
}
