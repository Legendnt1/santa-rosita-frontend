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

  /** ISO 4217 currency code (e.g. "PEN") */
  readonly currency: string;

  /** Available stock quantity */
  readonly stock: number;

  /** Relative URL path to the product image */
  readonly imageUrl: string;

  /** Foreign key referencing the parent Category */
  readonly categoryId: string;
}
