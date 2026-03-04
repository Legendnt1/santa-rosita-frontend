/**
 * Sorting options for product listings.
 */
export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

/**
 * Criteria used to filter and sort products in the catalog.
 * All fields are optional — omitted fields apply no constraint.
 *
 * @remarks
 * This value object belongs to the domain layer and must remain
 * framework-agnostic. URL query-param parsing happens in the
 * presentation layer before constructing this object.
 */
export interface FilterCriteria {
  /** Category slug to filter by */
  readonly categorySlug?: string;

  /** Minimum price (inclusive) */
  readonly minPrice?: number;

  /** Maximum price (inclusive) */
  readonly maxPrice?: number;

  /** Minimum average rating (inclusive, 1–5) */
  readonly minRating?: number;

  /** Filter by specific brand names */
  readonly brands?: readonly string[];

  /** When true, show only products with stock > 0 */
  readonly inStockOnly?: boolean;

  /** Sort order for results */
  readonly sort?: SortOption;
}
