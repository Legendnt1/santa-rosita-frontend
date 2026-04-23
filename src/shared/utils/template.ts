/**
 * Replaces `{placeholder}` tokens in a template string with the provided
 * values. Unmatched placeholders are left untouched so missing translation
 * keys remain visible during development instead of failing silently.
 *
 * @example
 *   interpolate("Shop {category} | {store}", { category: "Brakes", store: "SR" })
 *   // → "Shop Brakes | SR"
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
