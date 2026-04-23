import { cache } from "react";
import { InMemoryCatalogRepository } from "./adapters/InMemoryCatalogRepository";
import type { CatalogRepository } from "../domain/repository/CatalogRepository";

/**
 * Shared repository instance reused across server components.
 * Each read method is wrapped in `React.cache()` to deduplicate identical
 * calls inside the same server request (Navbar + page + breadcrumb).
 *
 * Swap the adapter line when migrating to an API-based implementation.
 */
const adapter = new InMemoryCatalogRepository();

export const catalogRepository: CatalogRepository = {
  getCategories: cache(adapter.getCategories.bind(adapter)),
  getCategoryBySlug: cache(adapter.getCategoryBySlug.bind(adapter)),
  getProductsByCategory: cache(adapter.getProductsByCategory.bind(adapter)),
  findByFilters: cache(adapter.findByFilters.bind(adapter)),
  getBrandsByCategory: cache(adapter.getBrandsByCategory.bind(adapter)),
  getProductById: cache(adapter.getProductById.bind(adapter)),
  getAllBrands: cache(adapter.getAllBrands.bind(adapter)),
};
