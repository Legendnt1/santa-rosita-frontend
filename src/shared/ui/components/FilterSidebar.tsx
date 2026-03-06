"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import type { FilterCriteria } from "@/modules/catalog/domain/entities/FilterCriteria";
import { Icon } from "./Icon";

/**
 * Props for the FilterSidebar client component.
 */
interface FilterSidebarProps {
  /** Current locale code */
  locale: string;
  /** Current category slug */
  categorySlug: string;
  /** All brand names available in this category */
  brands: string[];
  /** Currently active filters parsed from URL */
  currentFilters: FilterCriteria;
  /** Localized filter labels */
  labels: {
    title: string;
    price: string;
    priceMin: string;
    priceMax: string;
    rating: string;
    ratingUp: string;
    brand: string;
    availability: string;
    inStockOnly: string;
    apply: string;
    clear: string;
  };
  /** Localized sort labels */
  sortLabels: {
    label: string;
    relevance: string;
    priceAsc: string;
    priceDesc: string;
    ratingDesc: string;
    newest: string;
  };
}

/**
 * Collapsible section wrapper for filter groups.
 */
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50 pb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
      >
        {title}
        <Icon
          name="chevron-down"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="mt-1">{children}</div>}
    </div>
  );
}

/**
 * Client-side filter sidebar with faceted search.
 * Syncs all filter state with URL query params via `useSearchParams`.
 *
 * @remarks
 * Each filter change updates the URL, causing a server-side re-render
 * that fetches the filtered data. This enables deep linking and
 * browser back/forward navigation through filter states.
 */
export function FilterSidebar({
  locale,
  categorySlug,
  brands,
  currentFilters,
  labels,
  sortLabels,
}: FilterSidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ── Local state for price inputs (debounced) ────────────
  const [minPrice, setMinPrice] = useState(
    currentFilters.minPrice?.toString() ?? "",
  );
  const [maxPrice, setMaxPrice] = useState(
    currentFilters.maxPrice?.toString() ?? "",
  );

  // Mobile sidebar toggle
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hover state for the interactive star rating
  const [hoverRating, setHoverRating] = useState(0);

  /**
   * Builds a new URL with updated query params and navigates to it.
   */
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  /**
   * Handles sort change.
   */
  const handleSortChange = (sort: string) => {
    updateParams({ sort: sort === "relevance" ? null : sort });
  };

  /**
   * Handles rating filter selection.
   */
  const handleRatingChange = (rating: number) => {
    const current = currentFilters.minRating;
    updateParams({
      minRating: current === rating ? null : String(rating),
    });
  };

  /**
   * Handles brand toggle.
   */
  const handleBrandToggle = (brand: string) => {
    const current = currentFilters.brands ? [...currentFilters.brands] : [];
    const index = current.findIndex(
      (b) => b.toLowerCase() === brand.toLowerCase(),
    );

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(brand);
    }

    updateParams({
      brands: current.length > 0 ? current.join(",") : null,
    });
  };

  /**
   * Handles availability toggle.
   */
  const handleStockToggle = () => {
    updateParams({
      inStock: currentFilters.inStockOnly ? null : "1",
    });
  };

  /**
   * Applies the price range filter.
   */
  const applyPriceFilter = () => {
    updateParams({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    });
  };

  /**
   * Clears all filters.
   */
  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push(`/${locale}/catalog/${categorySlug}`, { scroll: false });
  };

  const currentSort = currentFilters.sort ?? "relevance";
  const hasActiveFilters =
    currentFilters.minPrice !== undefined ||
    currentFilters.maxPrice !== undefined ||
    currentFilters.minRating !== undefined ||
    (currentFilters.brands && currentFilters.brands.length > 0) ||
    currentFilters.inStockOnly;

  const sidebarContent = (
    <div className="flex flex-col gap-3">
      {/* ── Sort ─────────────────────────────────────────── */}
      <FilterSection title={sortLabels.label}>
        <div className="flex flex-col gap-1">
          {(
            [
              ["relevance", sortLabels.relevance],
              ["price-asc", sortLabels.priceAsc],
              ["price-desc", sortLabels.priceDesc],
              ["rating-desc", sortLabels.ratingDesc],
              ["newest", sortLabels.newest],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => handleSortChange(value)}
              className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                currentSort === value
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-foreground hover:bg-primary/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── Price Range ──────────────────────────────────── */}
      <FilterSection title={labels.price}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder={labels.priceMin}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-foreground-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="text-foreground-muted">—</span>
          <input
            type="number"
            min={0}
            placeholder={labels.priceMax}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyPriceFilter()}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-foreground-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="button"
          onClick={applyPriceFilter}
          className="mt-2 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          {labels.apply}
        </button>
      </FilterSection>

      {/* ── Rating ───────────────────────────────────────── */}
      <FilterSection title={labels.rating}>
        <div className="flex flex-col items-center gap-2 py-1">
          <div
            className="flex gap-1"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const activeRating = hoverRating || currentFilters.minRating || 0;
              const filled = star <= activeRating;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  className="group cursor-pointer p-0.5 transition-transform duration-300 ease-out"
                  aria-label={`${star} ${labels.ratingUp}`}
                >
                  <Icon
                    name="star-full"
                    className={`h-7 w-7 transition-colors duration-300 ease-out ${
                      filled
                        ? "text-amber-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.4)]"
                        : "text-border group-hover:text-amber-200"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {currentFilters.minRating && (
            <span className="text-xs text-foreground-muted">
              {currentFilters.minRating} {labels.ratingUp}
            </span>
          )}
        </div>
      </FilterSection>

      {/* ── Brands ───────────────────────────────────────── */}
      {brands.length > 0 && (
        <FilterSection title={labels.brand}>
          <div className="flex flex-col gap-1">
            {brands.map((brand) => {
              const isActive = currentFilters.brands?.some(
                (b) => b.toLowerCase() === brand.toLowerCase(),
              );
              return (
                <label
                  key={brand}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-primary/5"
                >
                  <input
                    type="checkbox"
                    checked={isActive ?? false}
                    onChange={() => handleBrandToggle(brand)}
                    className="h-3.5 w-3.5 rounded border-border accent-primary"
                  />
                  <span className="text-foreground">{brand}</span>
                </label>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* ── Availability ─────────────────────────────────── */}
      <FilterSection title={labels.availability}>
        <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-primary/5">
          <input
            type="checkbox"
            checked={currentFilters.inStockOnly ?? false}
            onChange={handleStockToggle}
            className="h-3.5 w-3.5 rounded border-border accent-primary"
          />
          <span className="text-foreground">{labels.inStockOnly}</span>
        </label>
      </FilterSection>

      {/* ── Clear All ────────────────────────────────────── */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground-muted transition-colors hover:border-accent hover:text-accent"
        >
          {labels.clear}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* ── Mobile toggle ──────────────────────────────── */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground shadow-sm transition-colors hover:bg-primary/5 lg:hidden"
      >
        <Icon name="filter" className="h-4 w-4" />
        {labels.title}
        {hasActiveFilters && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            !
          </span>
        )}
      </button>

      {/* ── Mobile overlay ─────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto bg-background p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-lg text-foreground">
                {labels.title}
              </h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-primary/10"
                aria-label="Close"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ────────────────────────────── */}
      <div className="hidden rounded-xl border border-border/50 bg-card/50 p-4 shadow-sm backdrop-blur-sm lg:block">
        <h2 className="mb-3 font-bold text-foreground">{labels.title}</h2>
        {sidebarContent}
      </div>
    </>
  );
}
