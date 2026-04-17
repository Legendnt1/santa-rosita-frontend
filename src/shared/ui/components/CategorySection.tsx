import type {
  Category,
  CategoryTheme,
} from "@/modules/catalog/domain/entities/Category";
import type { Product } from "@/modules/catalog/domain/entities/Product";
import { ProductCard } from "./ProductCard";

/**
 * Theme-specific style maps for each CategoryTheme.
 * The mockup uses light-tinted full-width backgrounds with dark text
 * and a solid pill-shaped button per category.
 */
const themeStyles: Record<CategoryTheme, { wrapper: string; button: string }> =
  {
    purple: {
      wrapper: "bg-category-purple-bg",
      button: "bg-category-purple-btn text-white hover:opacity-90",
    },
    earth: {
      wrapper: "bg-category-earth-bg",
      button: "bg-category-earth-btn text-white hover:opacity-90",
    },
  };

/**
 * Props for the CategorySection server component.
 */
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
    stock: string;
  };
}

/**
 * Renders a themed horizontal section for a product category.
 * Layout: left info panel + right scrollable product cards.
 * React 19 Server Component.
 *
 * @remarks
 * The visual theme (purple / earth) is driven by the `category.theme` field,
 * keeping domain logic decoupled from presentation concerns.
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
      className={`${styles.wrapper} mx-auto my-4 max-w-6xl overflow-hidden rounded-2xl sm:my-6`}
    >
      <div className="flex flex-col md:flex-row">
        {/* ── Info panel ─────────────────────────────────── */}
        <div className="flex flex-col justify-center gap-3 px-5 py-6 sm:gap-4 sm:px-8 sm:py-10 md:w-64">
          <h2 className="text-xl font-extrabold leading-tight text-foreground sm:text-2xl">
            {labels.title}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/75">
            {labels.description}
          </p>
          <a
            href={`/${locale}/catalog/${category.slug}`}
            className={`${styles.button} mt-1 inline-block w-fit rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-[0.98] sm:mt-2`}
          >
            {labels.searchButton}
          </a>
        </div>

        {/* ── Product cards ──────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 px-4 pb-5 sm:flex sm:flex-1 sm:gap-4 sm:overflow-x-auto sm:px-6 sm:py-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              labels={{ stock: labels.stock }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
