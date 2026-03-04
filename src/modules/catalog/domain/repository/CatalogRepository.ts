import type { Product } from '../entities/Product';
import type { Category } from '../entities/Category';
import type { FilterCriteria } from '../entities/FilterCriteria';

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
   * Retrieves a single category by its slug.
   * @param slug - The URL-safe category slug
   * @returns The category if found, or `null` otherwise
   */
  getCategoryBySlug(slug: string): Promise<Category | null>;

  /**
   * Retrieves products belonging to a specific category.
   * @param categoryId - The category identifier to filter by
   * @param limit - Maximum number of products to return (optional)
   * @returns Products matching the given category
   */
  getProductsByCategory(categoryId: string, limit?: number): Promise<Product[]>;

  /**
   * Retrieves products matching the given filter criteria.
   * Supports faceted search, sorting, and pagination.
   * @param filters - The filtering and sorting criteria
   * @returns Products matching all applied filters
   */
  findByFilters(filters: FilterCriteria): Promise<Product[]>;

  /**
   * Retrieves all distinct brand names for products in a category.
   * Used to populate the brand facet in the filter sidebar.
   * @param categorySlug - The category slug to scope brands to
   * @returns Sorted list of unique brand names
   */
  getBrandsByCategory(categorySlug: string): Promise<string[]>;

  /**
   * Retrieves a single product by its identifier.
   * @param id - The product identifier
   * @returns The product if found, or `null` otherwise
   */
  getProductById(id: string): Promise<Product | null>;
}
