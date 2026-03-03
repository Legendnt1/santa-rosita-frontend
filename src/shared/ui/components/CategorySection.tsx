import type { Category, CategoryTheme } from '@/modules/catalog/domain/entities/Category';
import type { Product } from '@/modules/catalog/domain/entities/Product';
import { ProductCard } from './ProductCard';

/**
 * Theme-specific style maps for each CategoryTheme.
 * The mockup uses light-tinted full-width backgrounds with dark text
 * and a solid pill-shaped button per category.
 */
const themeStyles: Record<
  CategoryTheme,
  { wrapper: string; button: string }
> = {
  purple: {
    wrapper: 'bg-category-purple-bg',
    button: 'bg-category-purple-btn text-white hover:opacity-90',
  },
  earth: {
    wrapper: 'bg-category-earth-bg',
    button: 'bg-category-earth-btn text-white hover:opacity-90',
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
  labels,
}: CategorySectionProps) {
  const styles = themeStyles[category.theme];

  return (
    <section
      className={`${styles.wrapper} mx-auto my-6 max-w-6xl overflow-hidden rounded-2xl`}
    >
      <div className="flex flex-col md:flex-row">
        {/* ── Info panel ─────────────────────────────────── */}
        <div className="flex flex-col justify-center gap-3 px-8 py-8 md:w-60">
          <h2 className="font-bold text-xl leading-tight text-foreground">
            {labels.title}
          </h2>
          <p className="text-sm leading-snug text-foreground/70">
            {labels.description}
          </p>
          <button
            type="button"
            className={`${styles.button} mt-2 w-fit cursor-pointer rounded-full px-8 py-2.5 font-semibold text-sm transition-all`}
          >
            {labels.searchButton}
          </button>
        </div>

        {/* ── Product cards ──────────────────────────────── */}
        <div className="flex flex-1 gap-4 overflow-x-auto px-6 py-6">
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
