import type { Product } from "@/modules/catalog/domain/entities/Product";

/**
 * Returns the price the customer actually pays (discount or full price).
 */
export function getEffectivePrice(product: Product): number {
  return product.discountPrice ?? product.price;
}

/**
 * Whether the product has an active discount.
 */
export function hasDiscount(product: Product): boolean {
  return product.discountPrice !== undefined;
}

/**
 * Percentage saved vs. the list price (0 when no discount).
 */
export function getDiscountPercent(product: Product): number {
  if (!hasDiscount(product)) return 0;
  return Math.round(
    ((product.price - product.discountPrice!) / product.price) * 100,
  );
}

/**
 * Absolute savings amount (0 when no discount).
 */
export function getSavingsAmount(product: Product): number {
  if (!hasDiscount(product)) return 0;
  return product.price - product.discountPrice!;
}

/**
 * Formats a price with 2 decimal places prefixed by the currency.
 */
export function formatPrice(currency: string, amount: number): string {
  return `${currency} ${amount.toFixed(2)}`;
}

/**
 * Replaces the `{date}` placeholder in a delivery label template.
 */
export function formatDeliveryText(template: string, date: string): string {
  return template.replace("{date}", date);
}
