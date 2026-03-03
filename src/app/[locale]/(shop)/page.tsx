import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { InMemoryCatalogRepository } from '@/modules/catalog/infrastructure/adapters/InMemoryCatalogRepository';
import { Navbar } from '@/shared/ui/components/Navbar';
import { CategorySection } from '@/shared/ui/components/CategorySection';

/**
 * Home page for the shop.
 * Loads the locale dictionary and catalog data, then renders
 * the Navbar and category sections as a React 19 Server Component.
 *
 * @remarks
 * Data fetching happens at the server level — no client-side
 * waterfalls. The repository adapter can be swapped without
 * touching this page (Hexagonal Architecture).
 */
export default async function ShopHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  // ── Data fetching (adapter can be swapped via DI) ───────
  const repository = new InMemoryCatalogRepository();
  const categories = await repository.getCategories();

  const categoryProducts = await Promise.all(
    categories.map(async (category) => ({
      category,
      products: await repository.getProductsByCategory(category.id, 4),
    }))
  );

  return (
    <>
      <Navbar dict={dict} locale={locale} />

      <main className="px-3 pb-8 sm:px-4 sm:pb-12">
        {categoryProducts.map(({ category, products }) => {
          const catalogEntry = dict.catalog[category.slug];

          return (
            <CategorySection
              key={category.id}
              category={category}
              products={products}
              labels={{
                title: catalogEntry?.title ?? category.slug,
                description: catalogEntry?.description ?? '',
                searchButton: dict.common.searchButton,
                stock: dict.common.stock,
              }}
            />
          );
        })}
      </main>
    </>
  );
}
