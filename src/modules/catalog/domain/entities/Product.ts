/**
 * Represents a product in the catalog.
 * Pure domain entity — contains no framework or infrastructure dependencies.
 *
 * @remarks
 * The `name` field stores the canonical (non-localized) product name.
 * Localized labels should come from the i18n dictionary layer.
 */
export interface Product {
  /** Unique product identifier */
  readonly id: string;

  /** Canonical (non-localized) product name */
  readonly name: string;

  /** Unit price in the specified currency */
  readonly price: number;

  /** Discounted price — present only when the product is on sale */
  readonly discountPrice?: number;

  /** ISO 4217 currency code (e.g. "PEN") */
  readonly currency: string;

  /** Available stock quantity */
  readonly stock: number;

  /** Primary product image (used in listing cards) */
  readonly imageUrl: string;

  /**
   * Additional product images for the detail gallery.
   * First item is the main image; the rest are alternate views.
   */
  readonly images: readonly string[];

  /**
   * Bullet-point feature descriptions (non-localized).
   * Displayed in the "About this item" section of the PDP.
   */
  readonly features: readonly string[];

  /** Foreign key referencing the parent Category */
  readonly categoryId: string;

  /** Average customer rating (1–5) */
  readonly rating: number;

  /** Total number of customer reviews */
  readonly reviewCount: number;

  /** Manufacturer / brand name */
  readonly brand: string;

  /** Estimated delivery date (pre-formatted, e.g. "Mar 10") */
  readonly deliveryDate: string;
}
