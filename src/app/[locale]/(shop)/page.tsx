import { Suspense, ViewTransition } from 'react';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { catalogRepository } from '@/modules/catalog/infrastructure/catalog-repository.instance';
import { CategorySection } from '@/shared/ui/components/CategorySection';
import { DirectionalTransition } from '@/shared/ui/components/DirectionalTransition';

/**
 * Home page for the shop.
 * Loads the locale dictionary and catalog data, then renders
 * the category sections as a React 19 Server Component.
 *
 * @remarks
 * The dictionary and category list are fetched in parallel at the top level.
 * The per-category product rails are wrapped in a `<Suspense>` boundary so the
 * shell (Navbar + Footer) streams immediately while the data-heavy section
 * resolves. The repository adapter can be swapped without touching this page
 * (Hexagonal Architecture).
 */
interface ShopHomePageProps {
  params: Promise<{ locale: Locale }>;
}

/** Skeleton mirroring the editorial CategorySection layout (info panel + 4 cards). */
function CategoryRailsSkeleton() {
  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      {Array.from({ length: 4 }).map((_, i) => (
        <section
          key={i}
          className="mx-auto my-0 w-full max-w-6xl overflow-hidden rounded-2xl bg-card/40 ring-1 ring-border/40"
        >
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col gap-3 px-5 py-6 sm:px-8 sm:py-10 md:w-72">
              <div className="h-1 w-10 animate-pulse rounded-full bg-card/60" />
              <div className="h-7 w-40 animate-pulse rounded bg-card/60" />
              <div className="h-4 w-56 animate-pulse rounded bg-card/40" />
              <div className="mt-2 h-9 w-32 animate-pulse rounded-full bg-card/60" />
            </div>
            <div className="grid flex-1 grid-cols-2 gap-3 px-4 pb-6 sm:flex sm:gap-4 sm:px-6 sm:py-7">
              {Array.from({ length: 4 }).map((__, j) => (
                <div
                  key={j}
                  className="h-60 w-full animate-pulse rounded-xl bg-card/50 sm:w-44 md:w-48"
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * Async leaf that resolves all category rails. Lives inside a Suspense boundary
 * so the Navbar and DirectionalTransition shell render immediately while the
 * per-category fetches resolve in parallel.
 */
async function CategoryRails({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const categories = await catalogRepository.getCategories();

  // All per-category fetches fire in parallel — no waterfall.
  const categoryProducts = await Promise.all(
    categories.map(async (category) => ({
      category,
      products: await catalogRepository.getProductsByCategory(category.id, 4),
    })),
  );

  return (
    <>
      {categoryProducts.map(({ category, products }) => {
        const catalogEntry = dict.catalog[category.slug];
        return (
          <CategorySection
            key={category.id}
            category={category}
            products={products}
            locale={locale}
            labels={{
              title: catalogEntry?.title ?? category.slug,
              description: catalogEntry?.description ?? '',
              searchButton: dict.common.searchButton,
              inStock: dict.common.inStock,
              lowStock: dict.common.lowStock,
              outOfStock: dict.common.outOfStock,
            }}
          />
        );
      })}
    </>
  );
}

export default async function ShopHomePage({ params }: ShopHomePageProps) {
  const { locale } = await params;
  // The dictionary is the only synchronous dependency the shell needs to
  // render skeleton labels — fetch it eagerly, then stream the rails.
  const dict = await getDictionary(locale);

  return (
    <DirectionalTransition>
      <main className="px-3 pb-8 sm:px-4 sm:pb-12">
        <Suspense
          fallback={
            <ViewTransition exit="slide-down">
              <CategoryRailsSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up" default="none">
            <CategoryRails locale={locale} dict={dict} />
          </ViewTransition>
        </Suspense>
      </main>
    </DirectionalTransition>
  );
}
