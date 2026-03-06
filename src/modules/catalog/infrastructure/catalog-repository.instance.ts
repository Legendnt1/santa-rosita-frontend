import { InMemoryCatalogRepository } from "./adapters/InMemoryCatalogRepository";
import type { CatalogRepository } from "../domain/repository/CatalogRepository";

/**
 * Shared repository instance reused across server components.
 * Avoids creating a new InMemoryCatalogRepository on every request.
 *
 * Swap this single line when migrating to an API-based adapter.
 */
export const catalogRepository: CatalogRepository =
  new InMemoryCatalogRepository();
