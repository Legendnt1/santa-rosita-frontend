import type { Locale } from '@/i18n/config';
import type { FilterCriteria, SortOption } from '@/modules/catalog/domain/entities/FilterCriteria';
import { getDictionary } from '@/i18n/getDictionary';
import { InMemoryCatalogRepository } from '@/modules/catalog/infrastructure/adapters/InMemoryCatalogRepository';
import { Navbar } from '@/shared/ui/components/Navbar';
import { ResultsHeader } from '@/shared/ui/components/ResultsHeader';
import { FilterSidebar } from '@/shared/ui/components/FilterSidebar'; 
import { ProductGrid } from '@/shared/ui/components/ProductGrid'; 
import { notFound } from 'next/navigation';

/**
 * Valid sort values used for query-param validation.
 */
const VALID_SORTS: ReadonlySet<string> = new Set([
  'relevance',
  'price-asc',
  'price-desc',
  'rating-desc',
  'newest',
]);

/**
 * Parses and validates the URL search params into a strongly-typed FilterCriteria.
 * Invalid values are silently dropped (defensive parsing).
 */
function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
  categorySlug: string
): FilterCriteria {
  const minPrice = Number(searchParams.minPrice);
  const maxPrice = Number(searchParams.maxPrice);
  const minRating = Number(searchParams.minRating);
  const sortRaw = String(searchParams.sort ?? 'relevance');
  const inStock = searchParams.inStock === '1';

  const brandsRaw = searchParams.brands;
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
 * Product listing page for a specific category.
 * Server Component — fetches filtered data based on URL query params.
 *
 * Route: /[locale]/catalog/[categorySlug]
 *
 * @remarks
 * All filter state lives in URL search params, enabling deep-linking
 * and server-side filtering without client-side state management.
 */
export default async function ProductListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, categorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  const dict = await getDictionary(locale as Locale);
  const repository = new InMemoryCatalogRepository();

  // ── Validate category ─────────────────────────────────────
  const category = await repository.getCategoryBySlug(categorySlug);
  if (!category) notFound();

  // ── Build filters & fetch data in parallel ────────────────
  const filters = parseSearchParams(resolvedSearchParams, categorySlug);
  const [products, brands] = await Promise.all([
    repository.findByFilters(filters),
    repository.getBrandsByCategory(categorySlug),
  ]);

  const categoryTitle =
    dict.catalog[categorySlug]?.title ?? categorySlug;

  return (
    <>
      <Navbar dict={dict} locale={locale} />

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        {/* ── Breadcrumbs & result count ────────────────── */}
        <ResultsHeader
          locale={locale}
          categoryTitle={categoryTitle}
          totalResults={products.length}
          labels={{
            home: dict.listing.breadcrumbHome,
            catalog: dict.listing.breadcrumbCatalog,
            resultsCount: dict.listing.resultsCount,
          }}
        />

        {/* ── Main layout: sidebar + grid ──────────────── */}
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:gap-6">
          {/* Filter sidebar */}
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

          {/* Product grid */}
          <section className="flex-1">
            <ProductGrid
              products={products}
              labels={{
                noResults: dict.listing.noResults,
                clearFilters: dict.listing.clearFilters,
                reviews: dict.listing.product.reviews,
                delivery: dict.listing.product.delivery,
                outOfStock: dict.listing.product.outOfStock,
                addToCart: dict.listing.product.addToCart,
                stock: dict.common.stock,
              }}
              locale={locale}
              categorySlug={categorySlug}
            />
          </section>
        </div>
      </main>
    </>
  );
}
