import { cache } from 'react';
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
    inStock: string;
    lowStock: string;
    outOfStock: string;
    currency: string;
    logoAlt: string;
    home: string;
    cart: string;
  };
  navbar: {
    categories: string;
    newProducts: string;
    discounts: string;
    brands: string;
    seeAll: string;
    groupPurple: string;
    groupEarth: string;
    groupSky: string;
    groupForest: string;
    themeLight: string;
    themeDark: string;
    changeLanguage: string;
  };
  catalog: Record<string, CategoryDictionary>;
  listing: {
    resultsCount: string;
    noResults: string;
    clearFilters: string;
    breadcrumbHome: string;
    breadcrumbCatalog: string;
    filters: {
      title: string;
      price: string;
      priceMin: string;
      priceMax: string;
      rating: string;
      ratingUp: string;
      brand: string;
      availability: string;
      inStockOnly: string;
      apply: string;
      clear: string;
      close: string;
    };
    sort: {
      label: string;
      relevance: string;
      priceAsc: string;
      priceDesc: string;
      ratingDesc: string;
      newest: string;
    };
    product: {
      reviews: string;
      delivery: string;
      outOfStock: string;
      viewProduct: string;
      ratingLabel: string;
    };
    viewCategory: string;
    categoriesCount: string;
  };
  pdp: {
    breadcrumbProduct: string;
    aboutThisItem: string;
    reviews: string;
    ratingLabel: string;
    inStock: string;
    outOfStock: string;
    onlyXLeft: string;
    price: string;
    listPrice: string;
    youSave: string;
    quantity: string;
    addToCart: string;
    buyNow: string;
    deliverTo: string;
    delivery: string;
    secureTransaction: string;
    soldBy: string;
    storeName: string;
    brand: string;
    returnPolicy: string;
    breadcrumbHome: string;
    breadcrumbCatalog: string;
    viewImage: string;
  };
  cart: {
    title: string;
    empty: string;
    emptySubtitle: string;
    continueShopping: string;
    remove: string;
    orderSummary: string;
    subtotal: string;
    shipping: string;
    shippingNote: string;
    total: string;
    checkout: string;
    clear: string;
    qty: string;
    items: string;
    addedToCart: string;
    decreaseQty: string;
    increaseQty: string;
    close: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    submit: string;
    submitRegister: string;
    switchToRegister: string;
    switchToLogin: string;
    forgotPassword: string;
    signIn: string;
    signUp: string;
    logout: string;
    togglePassword: string;
    placeholders: {
      name: string;
      email: string;
      password: string;
    };
    errors: {
      invalidCredentials: string;
      emailTaken: string;
      passwordMismatch: string;
      required: string;
      invalidEmail: string;
      unknown: string;
    };
  };
  meta: {
    title: string;
    description: string;
    /** Catalog index page (`/catalog`) */
    catalog: {
      title: string;
      description: string;
    };
    /** Category listing page — unfiltered (`/catalog/[slug]`) */
    category: {
      title: string;
      description: string;
    };
    /** Category listing with active filters (e.g. ?brands=…) */
    categoryFiltered: {
      title: string;
      description: string;
    };
    /** Product detail page (`/catalog/product/[id]`) */
    product: {
      title: string;
      description: string;
      ogAlt: string;
    };
  };
  footer: {
    tagline: string;
    legalHeading: string;
    privacy: string;
    terms: string;
    dataProtection: string;
    contactHeading: string;
    followUs: string;
    social: {
      facebook: string;
      instagram: string;
      whatsapp: string;
      twitter: string;
    };
    rights: string;
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
 * Wrapped in `React.cache` so that multiple Server Components in the same
 * request tree (e.g. layout + page) share a single resolved dictionary
 * without redundant dynamic imports.
 *
 * @param locale - A valid locale code (es | en | zh)
 * @returns The fully resolved dictionary object
 */
export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]();
});
