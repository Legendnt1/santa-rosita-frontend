/**
 * Visual theme identifier for category sections.
 * Maps to a specific color palette applied in the UI layer.
 *
 * - `purple` — Brand violet   (engine, transmission, steering)
 * - `earth`  — Warm terracotta (brakes, suspension, lubrication)
 * - `sky`    — Steel blue     (electrical, cooling, fuel, lighting)
 * - `forest` — Sage teal      (body, interior, exhaust, wheels, accessories)
 */
export type CategoryTheme = 'purple' | 'earth' | 'sky' | 'forest';

/**
 * Represents a product category in the catalog.
 * Pure domain entity — contains no framework or infrastructure dependencies.
 *
 * @remarks
 * The `slug` field doubles as the key used to look up localized
 * titles and descriptions in the i18n dictionary (e.g. `dict.catalog[slug]`).
 */
export interface Category {
  /** Unique category identifier */
  readonly id: string;

  /** URL-safe slug, also used as the i18n dictionary key */
  readonly slug: string;

  /** Visual theme applied to the category section UI */
  readonly theme: CategoryTheme;
}
