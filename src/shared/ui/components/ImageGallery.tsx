"use client";

import Image from "next/image";
import { useState, ViewTransition } from "react";

/**
 * Props for the ImageGallery client component.
 */
interface ImageGalleryProps {
  /** All product images — first is the default main image */
  images: readonly string[];
  /** Product name used as alt text */
  productName: string;
  /** Product id — used to build the shared `view-transition-name` so the
   *  grid card image morphs into the PDP main image during navigation. */
  productId: string;
  /** Localized label template for thumbnail buttons, e.g. "View image {index}" */
  viewImageLabel: string;
}

/**
 * Amazon-inspired image gallery with vertical thumbnails and a main image.
 *
 * Desktop: thumbnails stacked vertically on the left, main image on the right.
 * Mobile:  main image on top, horizontal thumbnail strip below.
 *
 * @remarks
 * Client component — manages selected-image state locally.
 * Main image is marked `priority` because it is the PDP LCP candidate.
 */
export function ImageGallery({
  images,
  productName,
  productId,
  viewImageLabel,
}: ImageGalleryProps) {
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
            aria-label={viewImageLabel.replace('{index}', String(index + 1))}
          >
            <Image
              src={src}
              alt={`${productName} — view ${index + 1}`}
              width={64}
              height={64}
              className="h-14 w-14 object-contain sm:h-16 sm:w-16"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      {/* ── Main image ───────────────────────────────────── */}
      <ViewTransition name={`product-image-${productId}`} share="morph">
        <div className="relative flex flex-1 items-center justify-center rounded-xl border border-border/30 bg-white p-4 sm:p-8 min-h-85 sm:min-h-110">
          <Image
            key={mainImage}
            src={mainImage}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1280px) 560px, (min-width: 1024px) 42vw, 100vw"
            className="animate-fade-in object-contain p-4 sm:p-8"
          />
        </div>
      </ViewTransition>
    </div>
  );
}
