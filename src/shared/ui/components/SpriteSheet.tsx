import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

/**
 * Reads `public/assets/icons/icons.svg` from disk on the server.
 *
 * @remarks
 * - `React.cache` dedupes the read across the whole render tree, so even
 *   though the file is small (~15 KB) we never read it twice in a single
 *   request.
 * - The XML prolog (`<?xml … ?>`) is stripped — it is invalid inside an
 *   HTML body and would trigger an HTML parser warning.
 * - The file is read at request time but the OS-level page cache + Node
 *   filesystem cache make this effectively free after the first hit.
 */
const getSpriteMarkup = cache(async (): Promise<string> => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "assets",
    "icons",
    "icons.svg",
  );
  const raw = await readFile(filePath, "utf-8");
  return raw.replace(/<\?xml[^?]*\?>\s*/, "");
});

/**
 * Inlines the entire icon sprite into the document body.
 *
 * @remarks
 * Rendering this once at the top of `<body>` lets every `<Icon>` reference
 * a `<symbol>` via a same-document fragment (`<use href="#name">`), which
 * means **zero** HTTP requests for icons — eliminating the redundant
 * `icons.svg` fetches that show up on every SPA navigation when the sprite
 * lives in `/public`.
 *
 * The container is positioned out of flow with `width: 0; height: 0;` so
 * it never affects layout or accessibility tree.
 */
export async function SpriteSheet() {
  const markup = await getSpriteMarkup();

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
