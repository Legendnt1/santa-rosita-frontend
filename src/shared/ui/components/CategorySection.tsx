import Link from "next/link";
import type {
  Category,
  CategoryTheme,
} from "@/modules/catalog/domain/entities/Category";
import type { Product } from "@/modules/catalog/domain/entities/Product";
import { ProductCard } from "./ProductCard";
import { Icon } from "./Icon";

/**
 * Per-theme tokens. `--category-*-bg` is the soft section surface,
 * `--category-*-accent` paints the decorative bar, and `--category-*-btn`
 * colors the call-to-action. Three tokens keep dark mode legible: the
 * surface is a subtle tint of card, the accent + button carry saturation.
 */
const themeStyles: Record<
  CategoryTheme,
  { wrapper: string; accent: string; button: string }
> = {
  purple: {
    wrapper: "bg-category-purple-bg",
    accent: "bg-category-purple-accent",
    button: "bg-category-purple-btn text-white hover:brightness-110",
  },
  earth: {
    wrapper: "bg-category-earth-bg",
    accent: "bg-category-earth-accent",
    button: "bg-category-earth-btn text-white hover:brightness-110",
  },
  sky: {
    wrapper: "bg-category-sky-bg",
    accent: "bg-category-sky-accent",
    button: "bg-category-sky-btn text-white hover:brightness-110",
  },
  forest: {
    wrapper: "bg-category-forest-bg",
    accent: "bg-category-forest-accent",
    button: "bg-category-forest-btn text-white hover:brightness-110",
  },
};

interface CategorySectionProps {
  /** The category entity (provides theme & id) */
  category: Category;
  /** Products to display in this section (typically 4) */
  products: Product[];
  /** Current locale code for building links */
  locale: string;
  /** Localized labels injected from the page */
  labels: {
    title: string;
    description: string;
    searchButton: string;
    inStock: string;
    lowStock: string;
    outOfStock: string;
  };
}

/**
 * Renders a themed horizontal section for a product category.
 *
 * @remarks
 * Layout is intentionally editorial: a vertical accent bar + uppercase
 * eyebrow + strong display title on the left, and a product rail on the
 * right. The soft tinted surface lets product photos carry the visual
 * weight — appropriate for a trade-audience catalog (buyers 25–60).
 */
export function CategorySection({
  category,
  products,
  locale,
  labels,
}: CategorySectionProps) {
  const styles = themeStyles[category.theme];

  return (
    <section
      className={`${styles.wrapper} mx-auto my-5 max-w-6xl overflow-hidden rounded-2xl ring-1 ring-border/50 sm:my-7`}
    >
      <div className="flex flex-col md:flex-row">
        {/* ── Info panel ─────────────────────────────────── */}
        <div className="flex flex-col justify-between gap-5 px-5 py-6 sm:px-8 sm:py-10 md:w-72">
          <div className="flex flex-col gap-3">
            {/* Accent dash — carries the category color identity without
                duplicating the title as an eyebrow label. */}
            <span
              aria-hidden
              className={`${styles.accent} h-1 w-10 rounded-full sm:w-12`}
            />

            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
              {labels.title}
            </h2>
            <p className="text-sm leading-relaxed text-foreground/70 sm:text-[15px]">
              {labels.description}
            </p>
          </div>

          <Link
            href={`/${locale}/catalog/${category.slug}`}
            transitionTypes={["nav-forward"]}
            className={`${styles.button} group/btn inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]`}
          >
            <span>{labels.searchButton}</span>
            <Icon
              name="chevron-right"
              className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>

        {/* ── Product cards ──────────────────────────────── */}
        <div className="product-grid grid grid-cols-2 gap-3 px-4 pb-6 sm:flex sm:flex-1 sm:gap-4 sm:overflow-x-auto sm:px-6 sm:py-7">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              labels={{
                inStock: labels.inStock,
                lowStock: labels.lowStock,
                outOfStock: labels.outOfStock,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
