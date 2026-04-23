import type { ReactNode } from "react";

/**
 * Shared shell for every catalog route — the index, category listings,
 * and product detail pages all render inside this `<main>`.
 *
 * @remarks
 * Centralising the container here locks three visual invariants across
 * the catalog:
 *
 * 1. **Max content width** (`max-w-7xl`) — breadcrumb, title and content
 *    columns align to the same grid on every screen.
 * 2. **Horizontal padding** (`px-3 sm:px-4 lg:px-6`) — prevents the
 *    per-page drift that appears when each page redefines its own
 *    `<main>` container.
 * 3. **Vertical rhythm** (`py-4 sm:py-6`) — identical top offset below
 *    the global navbar, so breadcrumbs land at the same Y on all routes.
 *
 * Child pages return breadcrumb + content directly (no inner `<main>`),
 * keeping the DOM flat and the layout authoritative.
 */
export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      {children}
    </main>
  );
}
