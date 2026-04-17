/**
 * URL query parameter keys for the catalog listing page.
 * Centralizing these here decouples them from i18n and ensures
 * the backend contract is defined in one place.
 */
export const QP = {
  SORT: 'sort',
  MIN_PRICE: 'min_price',
  MAX_PRICE: 'max_price',
  MIN_RATING: 'min_rating',
  BRANDS: 'brands',
  IN_STOCK: 'in_stock',
} as const;

export type CatalogQueryParam = (typeof QP)[keyof typeof QP];

/**
 * Valid values for the `sort` query parameter.
 * These are backend-facing identifiers, not UI labels.
 */
export const SORT_VALUES = {
  RELEVANCE: 'relevance',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  RATING_DESC: 'rating_desc',
  NEWEST: 'newest',
} as const;

export const VALID_SORTS: ReadonlySet<string> = new Set(Object.values(SORT_VALUES));
