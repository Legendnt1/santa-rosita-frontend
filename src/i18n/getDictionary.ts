import type { Locale } from './config';

/**
 * Shape of a category entry inside the catalog section.
 */
export interface CategoryDictionary {
  title: string;
  description: string;
}

/**
 * Complete dictionary structure for application translations.
 * Organized by UI module for maintainability.
 */
export interface Dictionary {
  common: {
    searchPlaceholder: string;
    searchButton: string;
    stock: string;
    currency: string;
  };
  navbar: {
    categories: string;
    newProducts: string;
    discounts: string;
  };
  catalog: Record<string, CategoryDictionary>;
  meta: {
    title: string;
    description: string;
  };
}

/**
 * Lazy-loaded dictionary map keyed by locale.
 * Dynamic imports enable per-locale code-splitting.
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () =>
    import('./dictionaries/es.json').then((m) => m.default as unknown as Dictionary),
  en: () =>
    import('./dictionaries/en.json').then((m) => m.default as unknown as Dictionary),
  zh: () =>
    import('./dictionaries/zh.json').then((m) => m.default as unknown as Dictionary),
};

/**
 * Loads the translation dictionary for the specified locale.
 * Uses dynamic imports so only the requested locale bundle is loaded.
 *
 * @param locale - A valid locale code (es | en | zh)
 * @returns The fully resolved dictionary object
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
