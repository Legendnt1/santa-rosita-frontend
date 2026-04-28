import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import type { FilterCriteria, SortOption } from '@/modules/catalog/domain/entities/FilterCriteria';
import { getDictionary } from '@/i18n/getDictionary';
import { catalogRepository } from '@/modules/catalog/infrastructure/catalog-repository.instance';
import { QP, VALID_SORTS } from '@/shared/config/catalog-query-params';
import { ResultsHeader } from '@/shared/ui/components/ResultsHeader';
import { FilterSidebar } from '@/shared/ui/components/FilterSidebar';
import { ProductGrid } from '@/shared/ui/components/ProductGrid';
import { DirectionalTransition } from '@/shared/ui/components/DirectionalTransition';
import { interpolate } from '@/shared/utils/template';
import { notFound } from 'next/navigation';
import { Suspense, ViewTransition } from 'react';

/**
 * Parses and validates the URL search params into a strongly-typed FilterCriteria.
 * Invalid values are silently dropped (defensive parsing).
 */
function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
  categorySlug: string
): FilterCriteria {
  const minPrice = Number(searchParams[QP.MIN_PRICE]);
  const maxPrice = Number(searchParams[QP.MAX_PRICE]);
  const minRating = Number(searchParams[QP.MIN_RATING]);
  const sortRaw = String(searchParams[QP.SORT] ?? 'relevance');
  const inStock = searchParams[QP.IN_STOCK] === '1';

  const brandsRaw = searchParams[QP.BRANDS];
  const brands =
    typeof brandsRaw === 'string'
      ? brandsRaw.split(',').filter(Boolean)
      : Array.isArray(brandsRaw)
        ? brandsRaw.filter(Boolean)
        : undefined;

  return {
    categorySlug,
    minPrice: Number.isFinite(minPrice) && minPrice > 0 ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined,
    minRating:
      Number.isFinite(minRating) && minRating >= 1 && minRating <= 5
        ? minRating
        : undefined,
    brands: brands && brands.length > 0 ? brands : undefined,
    inStockOnly: inStock || undefined,
    sort: VALID_SORTS.has(sortRaw) ? (sortRaw as SortOption) : 'relevance',
  };
}

/**
 * Lightweight skeleton shown while the product grid is streaming.
 * Matches the responsive columns (2/3/4) of the real grid.
 */
function ProductGridSkeleton() {
  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-4 w-40 animate-pulse rounded bg-card/40" />
        <div className="h-4 w-24 animate-pulse rounded bg-card/40" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="h-120 w-full shrink-0 animate-pulse rounded-xl bg-card/40 lg:w-64 xl:w-72" />
        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-xl bg-card/40"
            />
          ))}
        </div>
      </div>
    </>
  );
}

/**
 * Async leaf component that performs the data-heavy work (products + brands).
 * Wrapping this in a Suspense boundary lets the Navbar and breadcrumb stream
 * immediately while the filtered catalog resolves.
 */
async function FilteredCatalog({
  locale,
  categorySlug,
  filters,
  dict,
}: {
  locale: Locale;
  categorySlug: string;
  filters: FilterCriteria;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const [products, brands] = await Promise.all([
    catalogRepository.findByFilters(filters),
    catalogRepository.getBrandsByCategory(categorySlug),
  ]);

  return (
    <>
      <ResultsHeader
        locale={locale}
        categoryTitle={dict.catalog[categorySlug]?.title ?? categorySlug}
        totalResults={products.length}
        labels={{
          home: dict.listing.breadcrumbHome,
          resultsCount: dict.listing.resultsCount,
        }}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <aside className="w-full shrink-0 lg:w-64 xl:w-72">
          <FilterSidebar
            locale={locale}
            categorySlug={categorySlug}
            brands={brands}
            currentFilters={filters}
            labels={dict.listing.filters}
            sortLabels={dict.listing.sort}
          />
        </aside>

        <section className="flex-1">
          <ProductGrid
            products={products}
            labels={{
              noResults: dict.listing.noResults,
              clearFilters: dict.listing.clearFilters,
              reviews: dict.listing.product.reviews,
              delivery: dict.listing.product.delivery,
              outOfStock: dict.listing.product.outOfStock,
              viewProduct: dict.listing.product.viewProduct,
              stock: dict.common.stock,
              ratingLabel: dict.listing.product.ratingLabel,
            }}
            locale={locale}
            categorySlug={categorySlug}
          />
        </section>
      </div>
    </>
  );
}

/**
 * Product listing page for a specific category.
 * Server Component — fetches filtered data based on URL query params.
 *
 * Route: /[locale]/catalog/[categorySlug]
 *
 * @remarks
 * The Navbar renders immediately; the filtered catalog streams in behind a
 * Suspense boundary so slow data sources do not block the shell.
 * All filter state lives in URL search params, enabling deep-linking.
 */
interface ProductListingPageProps {
  params: Promise<{ locale: Locale; categorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Summarizes the active query params into a human-readable filter label
 * used in the metadata title/description. Returns `null` when no
 * SEO-relevant filters are active — callers fall back to the unfiltered
 * category template in that case.
 *
 * @remarks
 * Sort order is intentionally excluded: it changes result ordering but not
 * the set of results, so indexing every sort variant separately would
 * dilute SEO signal without adding value.
 */
function buildFilterLabel(
  searchParams: Record<string, string | string[] | undefined>,
  filtersDict: Awaited<ReturnType<typeof getDictionary>>["listing"]["filters"],
): string | null {
  const parts: string[] = [];

  const brandsRaw = searchParams[QP.BRANDS];
  const brands =
    typeof brandsRaw === "string"
      ? brandsRaw.split(",").filter(Boolean)
      : Array.isArray(brandsRaw)
        ? brandsRaw.filter(Boolean)
        : [];
  if (brands.length > 0) parts.push(brands.join(", "));

  const min = Number(searchParams[QP.MIN_PRICE]);
  const max = Number(searchParams[QP.MAX_PRICE]);
  if (Number.isFinite(min) && min > 0) parts.push(`${filtersDict.priceMin} ${min}`);
  if (Number.isFinite(max) && max > 0) parts.push(`${filtersDict.priceMax} ${max}`);

  const rating = Number(searchParams[QP.MIN_RATING]);
  if (Number.isFinite(rating) && rating >= 1 && rating <= 5) {
    parts.push(`${rating}★ ${filtersDict.ratingUp}`);
  }

  if (searchParams[QP.IN_STOCK] === "1") parts.push(filtersDict.inStockOnly);

  return parts.length > 0 ? parts.join(" · ") : null;
}

/**
 * Metadata for a category listing. When the URL carries SEO-relevant
 * filters (brands, price, rating, availability) we switch to the
 * `categoryFiltered` template so the tab title and OG card reflect the
 * active narrowing. Unfiltered views use the canonical category template.
 *
 * @remarks
 * Category lookup + dictionary are fetched in parallel. Both calls hit
 * `React.cache`, so the page component re-uses the same resolved values
 * downstream — no duplicate I/O.
 */
export async function generateMetadata({
  params,
  searchParams,
}: ProductListingPageProps): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const [dict, category, resolvedSearchParams] = await Promise.all([
    getDictionary(locale),
    catalogRepository.getCategoryBySlug(categorySlug),
    searchParams,
  ]);

  if (!category) return {};

  const catalogEntry = dict.catalog[categorySlug];
  const categoryTitle = catalogEntry?.title ?? categorySlug;
  const categoryDescription = catalogEntry?.description ?? "";
  const filterLabel = buildFilterLabel(
    resolvedSearchParams,
    dict.listing.filters,
  );

  const base = {
    store: dict.pdp.storeName,
    category: categoryTitle,
    description: categoryDescription,
  };

  const tpl = filterLabel ? dict.meta.categoryFiltered : dict.meta.category;
  const values = filterLabel ? { ...base, filters: filterLabel } : base;

  const title = interpolate(tpl.title, values);
  const description = interpolate(tpl.description, values);

  return {
    title,
    description,
    // Canonical always points to the unfiltered listing so filter variants
    // don't fragment link equity across thousands of URL combinations.
    alternates: { canonical: `/${locale}/catalog/${categorySlug}` },
    // De-index filtered variants: they're useful for users, not for search.
    robots: filterLabel ? { index: false, follow: true } : undefined,
    openGraph: { title, description, type: "website", locale },
  };
}

export default async function ProductListingPage({ params, searchParams }: ProductListingPageProps) {
  const { locale, categorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  const dict = await getDictionary(locale);

  const category = await catalogRepository.getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const filters = parseSearchParams(resolvedSearchParams, categorySlug);

  return (
    <DirectionalTransition>
      <Suspense
        fallback={
          <ViewTransition exit="slide-down">
            <ProductGridSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" default="none">
          <FilteredCatalog
            locale={locale}
            categorySlug={categorySlug}
            filters={filters}
            dict={dict}
          />
        </ViewTransition>
      </Suspense>
    </DirectionalTransition>
  );
}
