import type { Product } from '../entities/Product';
import type { Category } from '../entities/Category';

/**
 * Port interface (driven side) for catalog data access.
 * Defines the contract that any catalog data source adapter must implement.
 *
 * @remarks
 * Following Hexagonal Architecture, this interface belongs to the **domain**
 * layer and must never depend on infrastructure details (databases, APIs, etc.).
 */
export interface CatalogRepository {
  /**
   * Retrieves all available product categories.
   * @returns Categories ordered by display priority
   */
  getCategories(): Promise<Category[]>;

  /**
   * Retrieves products belonging to a specific category.
   * @param categoryId - The category identifier to filter by
   * @param limit - Maximum number of products to return (optional)
   * @returns Products matching the given category
   */
  getProductsByCategory(categoryId: string, limit?: number): Promise<Product[]>;

  /**
   * Retrieves a single product by its identifier.
   * @param id - The product identifier
   * @returns The product if found, or `null` otherwise
   */
  getProductById(id: string): Promise<Product | null>;
}
