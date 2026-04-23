import type { Locale } from '@/i18n/config';
import type { FilterCriteria, SortOption } from '@/modules/catalog/domain/entities/FilterCriteria';
import { getDictionary } from '@/i18n/getDictionary';
import { catalogRepository } from '@/modules/catalog/infrastructure/catalog-repository.instance';
import { QP, VALID_SORTS } from '@/shared/config/catalog-query-params';
import { Navbar } from '@/shared/ui/components/Navbar';
import { ResultsHeader } from '@/shared/ui/components/ResultsHeader';
import { FilterSidebar } from '@/shared/ui/components/FilterSidebar';
import { ProductGrid } from '@/shared/ui/components/ProductGrid';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

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
        <div className="h-[480px] w-full shrink-0 animate-pulse rounded-xl bg-card/40 lg:w-64 xl:w-72" />
        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[320px] animate-pulse rounded-xl bg-card/40"
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

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:gap-6">
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
export default async function ProductListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; categorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, categorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  const dict = await getDictionary(locale);

  const category = await catalogRepository.getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const filters = parseSearchParams(resolvedSearchParams, categorySlug);

  return (
    <>
      <Navbar dict={dict} locale={locale} />

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <Suspense fallback={<ProductGridSkeleton />}>
          <FilteredCatalog
            locale={locale}
            categorySlug={categorySlug}
            filters={filters}
            dict={dict}
          />
        </Suspense>
      </main>
    </>
  );
}
