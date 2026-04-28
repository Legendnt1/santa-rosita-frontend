import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { catalogRepository } from "@/modules/catalog/infrastructure/catalog-repository.instance";
import { DirectionalTransition } from "@/shared/ui/components/DirectionalTransition";
import { Icon } from "@/shared/ui/components/Icon";
import { interpolate } from "@/shared/utils/template";

interface CatalogIndexPageProps {
  params: Promise<{ locale: Locale }>;
}

/**
 * Metadata for the catalog index — counts categories so the description
 * stays accurate as the catalog grows. Data fetches run in parallel with
 * the dictionary import; both are deduped across RSC calls by React.cache.
 */
export async function generateMetadata({
  params,
}: CatalogIndexPageProps): Promise<Metadata> {
  const { locale } = await params;
  const [dict, categories] = await Promise.all([
    getDictionary(locale),
    catalogRepository.getCategories(),
  ]);

  const values = {
    store: dict.pdp.storeName,
    count: categories.length,
  };
  const title = interpolate(dict.meta.catalog.title, values);
  const description = interpolate(dict.meta.catalog.description, values);

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/catalog` },
    openGraph: { title, description, type: "website", locale },
  };
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
  sky: {
    card: "border-category-sky-btn/20 hover:border-category-sky-btn/60 hover:shadow-category-sky-btn/10",
    icon: "text-category-sky-btn",
  },
  forest: {
    card: "border-category-forest-btn/20 hover:border-category-forest-btn/60 hover:shadow-category-forest-btn/10",
    icon: "text-category-forest-btn",
  },
};

export default async function CatalogIndexPage({ params }: CatalogIndexPageProps) {
  const { locale } = await params;
  const [dict, categories] = await Promise.all([
    getDictionary(locale),
    catalogRepository.getCategories(),
  ]);

  return (
    <DirectionalTransition>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          {dict.listing.breadcrumbCatalog}
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          {dict.listing.categoriesCount.replace('{count}', String(categories.length))}
        </p>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const entry = dict.catalog[category.slug];
          const styles = themeStyles[category.theme] ?? themeStyles.purple;

          return (
            <Link
              key={category.id}
              href={`/${locale}/catalog/${category.slug}`}
              transitionTypes={["nav-forward"]}
              className={`card-interactive group flex flex-col gap-3 p-5 animate-fade-in-up ${styles.card}`}
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
            </Link>
          );
        })}
      </div>
    </DirectionalTransition>
  );
}
