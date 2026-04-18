import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { catalogRepository } from "@/modules/catalog/infrastructure/catalog-repository.instance";
import { Navbar } from "@/shared/ui/components/Navbar";
import { Icon } from "@/shared/ui/components/Icon";

interface CatalogIndexPageProps {
  params: Promise<{ locale: Locale }>;
}

const themeStyles: Record<string, { card: string; icon: string }> = {
  purple: {
    card: "border-category-purple-btn/20 hover:border-category-purple-btn/60 hover:shadow-category-purple-btn/10",
    icon: "text-category-purple-btn",
  },
  earth: {
    card: "border-category-earth-btn/20 hover:border-category-earth-btn/60 hover:shadow-category-earth-btn/10",
    icon: "text-category-earth-btn",
  },
};

export default async function CatalogIndexPage({ params }: CatalogIndexPageProps) {
  const { locale } = await params;
  const [dict, categories] = await Promise.all([
    getDictionary(locale),
    catalogRepository.getCategories(),
  ]);

  return (
    <>
      <Navbar dict={dict} locale={locale} />

      <main className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
            {dict.listing.breadcrumbCatalog}
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {categories.length} {categories.length === 1 ? "categoría" : "categorías"}
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const entry = dict.catalog[category.slug];
            const styles = themeStyles[category.theme] ?? themeStyles.purple;

            return (
              <a
                key={category.id}
                href={`/${locale}/catalog/${category.slug}`}
                className={`card-interactive group flex flex-col gap-3 p-5 animate-fade-up ${styles.card}`}
              >
                {/* Content */}
                <div className="flex flex-1 flex-col gap-1.5">
                  <h2 className="text-base font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {entry?.title ?? category.slug}
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground-muted">
                    {entry?.description ?? ""}
                  </p>
                </div>

                {/* CTA row */}
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${styles.icon} transition-transform group-hover:translate-x-0.5`}>
                  {dict.listing.viewCategory}
                  <Icon name="chevron-right" className="h-3.5 w-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      </main>
    </>
  );
}
