'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Category, CategoryTheme } from '@/modules/catalog/domain/entities/Category';
import type { CategoryDictionary } from '@/i18n/getDictionary';
import { Icon } from './Icon';

/**
 * TODO: This should be an import from a import file, and not be duplicated here. We can export the THEME_ORDER from the domain layer, or define it in a shared constants file.
 */
const THEME_ORDER: CategoryTheme[] = ['purple', 'earth', 'sky', 'forest'];

/**
 * CategoriesNav Props
 */
interface CategoriesNavProps {
  categories: Category[];
  catalog: Record<string, CategoryDictionary>;
  brands: string[];
  locale: string;
  labels: {
    categories: string;
    newProducts: string;
    discounts: string;
    brands: string;
    seeAll: string;
    groupLabels: Record<CategoryTheme, string>;
  };
}

/**
 * CategoriesNav Component
 *
 * Renders a navigation bar with a dropdown menu for product categories and brands.
 * The menu is accessible and responsive, with keyboard support and proper ARIA attributes.
 * It also closes automatically on route changes or when clicking outside the menu.
 * The categories are grouped by theme, and the brands are displayed as clickable tags.
 * The component uses Tailwind CSS for styling and is designed to fit within a header layout.
 */
export function CategoriesNav({
  categories,
  catalog,
  brands,
  locale,
  labels,
}: CategoriesNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Reset open state on bfcache restore — without this, a frozen-open panel
  // leaves a full-viewport backdrop (z-[35]) that silently blocks clicks on
  // language/theme/logo controls after hitting the browser back button.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsOpen(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const grouped = THEME_ORDER.reduce<Record<CategoryTheme, Category[]>>(
    (acc, theme) => { acc[theme] = categories.filter((c) => c.theme === theme); return acc; },
    { purple: [], earth: [], sky: [], forest: [] }
  );

  const close = () => setIsOpen(false);

  return (
    // `relative` here is the containing block for the absolute panel below.
    // The panel is a sibling of the scrollable inner div, so overflow-x-auto
    // on that inner div does NOT clip it — no portal needed.
    <nav className="relative border-t border-border bg-navbar-sub-bg">

      {/* ── Sub-nav link row (scrollable on narrow screens) ── */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-3 py-2 text-xs font-medium text-navbar-fg whitespace-nowrap sm:gap-6 sm:px-4 sm:text-sm">
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className="flex shrink-0 items-center gap-1 transition-colors hover:text-primary"
        >
          <Icon name="menu-2" className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          <span>{labels.categories}</span>
          <Icon
            name="chevron-down"
            className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <a href="#" className="shrink-0 transition-colors hover:text-primary">
          {labels.newProducts}
        </a>
        <a href="#" className="shrink-0 transition-colors hover:text-primary">
          {labels.discounts}
        </a>
      </div>

      {/* ── Mega-menu panel + backdrop ────────────────────────
          Panel is absolute from this <nav>, appearing right below
          it — the overflow-x-auto inner div does NOT clip it.
          z-[51] sits inside the header stacking context (z-50),
          which paints it above all page content at root level.
          Backdrop is fixed inset-0 z-[35] — below the header (z-50)
          so Language / Theme buttons stay fully clickable. ──── */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[35]"
            aria-hidden="true"
            onClick={close}
          />

          <div
            role="region"
            aria-label={labels.categories}
            className="absolute inset-x-0 top-full z-[51] border-t border-border bg-card shadow-2xl animate-fade-in"
          >
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">

              {/* ── Categories ────────────────────────────── */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {THEME_ORDER.map((theme) => {
                  const cats = grouped[theme];
                  if (!cats.length) return null;
                  return (
                    <div key={theme}>
                      <p className="mb-2 border-b border-border pb-1.5 text-xs font-extrabold uppercase tracking-widest text-foreground-muted">
                        {labels.groupLabels[theme]}
                      </p>
                      <ul className="mt-2.5 space-y-2">
                        {cats.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              href={`/${locale}/catalog/${cat.slug}`}
                              className="rounded text-sm text-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                              onClick={close}
                            >
                              {catalog[cat.slug]?.title ?? cat.slug}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/${locale}/catalog`}
                        className="mt-3 inline-block rounded text-xs font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                        onClick={close}
                      >
                        {labels.seeAll} →
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* ── Divider ───────────────────────────────── */}
              <div className="my-5 border-t border-border" />

              {/* ── Brands ────────────────────────────────── */}
              <div>
                <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-foreground-muted">
                  {labels.brands}
                </p>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/${locale}/catalog?brand=${encodeURIComponent(brand)}`}
                      className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                      onClick={close}
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </nav>
  );
}
