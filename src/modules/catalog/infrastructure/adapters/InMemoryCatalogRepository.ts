import type { Product } from '../../domain/entities/Product';
import type { Category } from '../../domain/entities/Category';
import type { CatalogRepository } from '../../domain/repository/CatalogRepository';

/**
 * In-memory implementation of CatalogRepository.
 * Provides hardcoded mock data for development and testing.
 *
 * @remarks
 * This adapter will be replaced by an API-based implementation
 * once the backend service is available.
 */

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', slug: 'motorsAndTransmission', theme: 'purple' },
  { id: 'cat-2', slug: 'brakeSystem', theme: 'earth' },
];

const MOCK_PRODUCTS: Product[] = [
  // ── Motors & Transmission ──────────────────────────────────
  {
    id: 'prod-101',
    name: 'Automatic Transmission Assembly',
    price: 14.53,
    currency: 'PEN',
    stock: 1,
    imageUrl: '/assets/images/products/transmission-assembly.webp',
    categoryId: 'cat-1',
  },
  {
    id: 'prod-102',
    name: 'Timing Belt Kit',
    price: 14.53,
    currency: 'PEN',
    stock: 5,
    imageUrl: '/assets/images/products/timing-belt.webp',
    categoryId: 'cat-1',
  },
  {
    id: 'prod-103',
    name: 'Clutch Pressure Plate',
    price: 14.53,
    currency: 'PEN',
    stock: 7,
    imageUrl: '/assets/images/products/clutch-plate.webp',
    categoryId: 'cat-1',
  },
  {
    id: 'prod-104',
    name: 'Differential Gear Set',
    price: 14.53,
    currency: 'PEN',
    stock: 15,
    imageUrl: '/assets/images/products/differential-gear.webp',
    categoryId: 'cat-1',
  },
  // ── Brake System ───────────────────────────────────────────
  {
    id: 'prod-201',
    name: 'DOT 3 Brake Fluid 1L',
    price: 14.53,
    currency: 'PEN',
    stock: 1,
    imageUrl: '/assets/images/products/brake-fluid-1.webp',
    categoryId: 'cat-2',
  },
  {
    id: 'prod-202',
    name: 'DOT 3 Brake Fluid 500ml',
    price: 14.53,
    currency: 'PEN',
    stock: 5,
    imageUrl: '/assets/images/products/brake-fluid-2.webp',
    categoryId: 'cat-2',
  },
  {
    id: 'prod-203',
    name: 'Performance Brake Pads',
    price: 14.53,
    currency: 'PEN',
    stock: 7,
    imageUrl: '/assets/images/products/brake-pads.webp',
    categoryId: 'cat-2',
  },
  {
    id: 'prod-204',
    name: 'Brake Caliper Assembly',
    price: 14.53,
    currency: 'PEN',
    stock: 15,
    imageUrl: '/assets/images/products/brake-caliper.webp',
    categoryId: 'cat-2',
  },
];

export class InMemoryCatalogRepository implements CatalogRepository {
  /** @inheritdoc */
  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  }

  /** @inheritdoc */
  async getProductsByCategory(
    categoryId: string,
    limit?: number
  ): Promise<Product[]> {
    const filtered = MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId);
    return limit ? filtered.slice(0, limit) : filtered;
  }

  /** @inheritdoc */
  async getProductById(id: string): Promise<Product | null> {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
}
