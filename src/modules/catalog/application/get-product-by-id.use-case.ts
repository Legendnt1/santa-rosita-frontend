import type { Product } from '../domain/entities/Product';
import type { CatalogRepository } from '../domain/repository/CatalogRepository';

/**
 * Application-layer use case: retrieve a single product by its ID.
 *
 * @remarks
 * Encapsulates the business rule for fetching product details.
 * The repository adapter is injected, keeping this use case
 * decoupled from infrastructure concerns (Hexagonal Architecture).
 */
export class GetProductById {
  constructor(private readonly repository: CatalogRepository) {}

  /**
   * Executes the use case.
   * @param id - The product identifier
   * @returns The product if found, or `null` otherwise
   */
  async execute(id: string): Promise<Product | null> {
    return this.repository.getProductById(id);
  }
}
