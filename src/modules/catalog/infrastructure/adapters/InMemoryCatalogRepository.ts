import type { Product } from '../../domain/entities/Product';
import type { Category } from '../../domain/entities/Category';
import type { FilterCriteria } from '../../domain/entities/FilterCriteria';
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
  { id: 'cat-1',  slug: 'engine',                 theme: 'purple' },
  { id: 'cat-2',  slug: 'brakes',                 theme: 'earth'  },
  { id: 'cat-3',  slug: 'suspension',             theme: 'earth'  },
  { id: 'cat-4',  slug: 'steering',               theme: 'purple' },
  { id: 'cat-5',  slug: 'transmission',           theme: 'purple' },
  { id: 'cat-6',  slug: 'electrical_system',      theme: 'sky'    },
  { id: 'cat-7',  slug: 'cooling',                theme: 'sky'    },
  { id: 'cat-8',  slug: 'fuel_system',            theme: 'sky'    },
  { id: 'cat-9',  slug: 'exterior_body',          theme: 'forest' },
  { id: 'cat-10', slug: 'interior',               theme: 'forest' },
  { id: 'cat-11', slug: 'lighting',               theme: 'sky'    },
  { id: 'cat-12', slug: 'exhaust',                theme: 'forest' },
  { id: 'cat-13', slug: 'wheels_and_tires',       theme: 'forest' },
  { id: 'cat-14', slug: 'lubrication_and_filters', theme: 'earth' },
  { id: 'cat-15', slug: 'accessories',            theme: 'forest' },
];

const MOCK_PRODUCTS: Product[] = [
  // ── Transmission ───────────────────────────────────────────
  {
    id: 'prod-101',
    name: 'Automatic Transmission Assembly',
    price: 1249.99,
    currency: 'PEN',
    stock: 1,
    imageUrl: '/assets/images/products/transmission-assembly.webp',
    images: [
      '/assets/images/products/transmission-assembly.webp',
      '/assets/images/products/timing-belt.webp',
      '/assets/images/products/clutch-plate.webp',
    ],
    features: [
      'OEM-grade 6-speed automatic transmission assembly',
      'Precision-machined aluminum housing for heat dissipation',
      'Includes torque converter and valve body',
      'Fits most 2018–2024 sedan and SUV models',
      '12-month manufacturer warranty included',
    ],
    categoryId: 'cat-5',
    rating: 4.5,
    reviewCount: 128,
    brand: 'Aisin',
    deliveryDate: 'Mar 10',
  },
  {
    id: 'prod-102',
    name: 'Timing Belt Kit',
    price: 189.90,
    discountPrice: 149.90,
    currency: 'PEN',
    stock: 5,
    imageUrl: '/assets/images/products/timing-belt.webp',
    images: [
      '/assets/images/products/timing-belt.webp',
      '/assets/images/products/transmission-assembly.webp',
    ],
    features: [
      'Complete kit: belt, tensioner, and idler pulleys',
      'HNBR compound for superior heat and oil resistance',
      'Exact OE fitment — no modifications required',
      'Recommended replacement interval: 60,000–100,000 km',
    ],
    categoryId: 'cat-1',
    rating: 4.8,
    reviewCount: 342,
    brand: 'Gates',
    deliveryDate: 'Mar 7',
  },
  {
    id: 'prod-103',
    name: 'Clutch Pressure Plate',
    price: 320.00,
    currency: 'PEN',
    stock: 7,
    imageUrl: '/assets/images/products/clutch-plate.webp',
    images: [
      '/assets/images/products/clutch-plate.webp',
      '/assets/images/products/differential-gear.webp',
    ],
    features: [
      'Heavy-duty diaphragm spring design',
      'Heat-treated cast iron construction',
      'Balanced for smooth engagement and reduced vibration',
      'Compatible with standard and performance clutch discs',
    ],
    categoryId: 'cat-5',
    rating: 4.2,
    reviewCount: 56,
    brand: 'Valeo',
    deliveryDate: 'Mar 12',
  },
  {
    id: 'prod-104',
    name: 'Differential Gear Set',
    price: 879.50,
    currency: 'PEN',
    stock: 15,
    imageUrl: '/assets/images/products/differential-gear.webp',
    images: [
      '/assets/images/products/differential-gear.webp',
      '/assets/images/products/transmission-assembly.webp',
      '/assets/images/products/clutch-plate.webp',
    ],
    features: [
      'Hardened 8620 steel ring and pinion gears',
      '3.73 ratio optimized for balanced power and fuel economy',
      'Includes carrier bearings and installation shims',
      'Shot-peened teeth for extended fatigue life',
      'OE-spec tolerances for smooth, quiet operation',
    ],
    categoryId: 'cat-5',
    rating: 4.6,
    reviewCount: 89,
    brand: 'Eaton',
    deliveryDate: 'Mar 8',
  },
  {
    id: 'prod-105',
    name: 'Engine Oil Pan Gasket',
    price: 45.00,
    discountPrice: 35.50,
    currency: 'PEN',
    stock: 22,
    imageUrl: '/assets/images/products/transmission-assembly.webp',
    images: [
      '/assets/images/products/transmission-assembly.webp',
    ],
    features: [
      'Molded rubber gasket with steel core',
      'Resists oil, heat, and vibration for long life',
      'Direct-fit replacement — no sealant needed',
    ],
    categoryId: 'cat-1',
    rating: 4.1,
    reviewCount: 201,
    brand: 'Fel-Pro',
    deliveryDate: 'Mar 6',
  },
  {
    id: 'prod-106',
    name: 'Turbocharger Assembly',
    price: 2150.00,
    currency: 'PEN',
    stock: 0,
    imageUrl: '/assets/images/products/timing-belt.webp',
    images: [
      '/assets/images/products/timing-belt.webp',
      '/assets/images/products/transmission-assembly.webp',
      '/assets/images/products/differential-gear.webp',
    ],
    features: [
      'Dual ball-bearing CHRA for fast spool and durability',
      'T3/T4 hybrid design producing up to 450 HP',
      'CNC-machined billet compressor wheel',
      'Includes oil feed line and gaskets',
      '360° thrust bearing for reduced shaft play',
    ],
    categoryId: 'cat-1',
    rating: 4.9,
    reviewCount: 47,
    brand: 'Garrett',
    deliveryDate: 'Mar 15',
  },
  {
    id: 'prod-107',
    name: 'Flywheel Assembly',
    price: 560.00,
    currency: 'PEN',
    stock: 3,
    imageUrl: '/assets/images/products/clutch-plate.webp',
    images: [
      '/assets/images/products/clutch-plate.webp',
      '/assets/images/products/differential-gear.webp',
    ],
    features: [
      'Dual-mass flywheel with integrated torsion damper',
      'Reduces drivetrain vibration and noise',
      'OE-quality surface finish for consistent clutch grip',
      'Pre-balanced to ISO 1940 G6.3 standard',
    ],
    categoryId: 'cat-5',
    rating: 3.8,
    reviewCount: 34,
    brand: 'Valeo',
    deliveryDate: 'Mar 9',
  },
  {
    id: 'prod-108',
    name: 'Transmission Filter Kit',
    price: 78.90,
    discountPrice: 62.90,
    currency: 'PEN',
    stock: 18,
    imageUrl: '/assets/images/products/differential-gear.webp',
    images: [
      '/assets/images/products/differential-gear.webp',
      '/assets/images/products/timing-belt.webp',
    ],
    features: [
      'High-flow cellulose/synthetic blend filter media',
      'Includes new pan gasket and drain plug seal',
      'Traps particles down to 30 microns',
      'Recommended with every ATF change',
    ],
    categoryId: 'cat-5',
    rating: 4.3,
    reviewCount: 156,
    brand: 'Aisin',
    deliveryDate: 'Mar 6',
  },
  // ── Brake System ───────────────────────────────────────────
  {
    id: 'prod-201',
    name: 'DOT 3 Brake Fluid 1L',
    price: 32.50,
    currency: 'PEN',
    stock: 1,
    imageUrl: '/assets/images/products/brake-fluid-1.webp',
    images: [
      '/assets/images/products/brake-fluid-1.webp',
      '/assets/images/products/brake-fluid-2.webp',
    ],
    features: [
      'DOT 3 specification — dry boiling point 205 °C',
      'Compatible with all DOT 3 and DOT 4 systems',
      'Low moisture absorption for consistent pedal feel',
      'Meets FMVSS 116 and SAE J1703 standards',
    ],
    categoryId: 'cat-2',
    rating: 4.4,
    reviewCount: 215,
    brand: 'Bosch',
    deliveryDate: 'Mar 6',
  },
  {
    id: 'prod-202',
    name: 'DOT 3 Brake Fluid 500ml',
    price: 18.90,
    discountPrice: 14.90,
    currency: 'PEN',
    stock: 5,
    imageUrl: '/assets/images/products/brake-fluid-2.webp',
    images: [
      '/assets/images/products/brake-fluid-2.webp',
      '/assets/images/products/brake-fluid-1.webp',
    ],
    features: [
      'Compact 500 ml size — ideal for top-ups',
      'DOT 3 compliant with high boiling point protection',
      'Prevents vapor lock under extreme braking',
    ],
    categoryId: 'cat-2',
    rating: 4.3,
    reviewCount: 180,
    brand: 'Bosch',
    deliveryDate: 'Mar 6',
  },
  {
    id: 'prod-203',
    name: 'Performance Brake Pads',
    price: 245.00,
    currency: 'PEN',
    stock: 7,
    imageUrl: '/assets/images/products/brake-pads.webp',
    images: [
      '/assets/images/products/brake-pads.webp',
      '/assets/images/products/brake-caliper.webp',
      '/assets/images/products/brake-fluid-1.webp',
    ],
    features: [
      'Ceramic compound for low dust and quiet braking',
      'Scorched and burnished for immediate bite out of the box',
      'Chamfered and slotted to reduce NVH',
      'Includes stainless-steel hardware and shims',
      'ECE R90 homologation for road and track use',
    ],
    categoryId: 'cat-2',
    rating: 4.7,
    reviewCount: 423,
    brand: 'Brembo',
    deliveryDate: 'Mar 8',
  },
  {
    id: 'prod-204',
    name: 'Brake Caliper Assembly',
    price: 389.00,
    discountPrice: 329.00,
    currency: 'PEN',
    stock: 15,
    imageUrl: '/assets/images/products/brake-caliper.webp',
    images: [
      '/assets/images/products/brake-caliper.webp',
      '/assets/images/products/brake-pads.webp',
    ],
    features: [
      'Single-piston floating caliper — OE replacement',
      'Aluminum body with corrosion-resistant anodized finish',
      'Includes bracket, slider pins, and dust boots',
      'Pressure-tested to 2× operating load',
    ],
    categoryId: 'cat-2',
    rating: 4.6,
    reviewCount: 97,
    brand: 'Brembo',
    deliveryDate: 'Mar 9',
  },
  {
    id: 'prod-205',
    name: 'Brake Rotor Disc — Front',
    price: 175.00,
    currency: 'PEN',
    stock: 0,
    imageUrl: '/assets/images/products/brake-pads.webp',
    images: [
      '/assets/images/products/brake-pads.webp',
      '/assets/images/products/brake-caliper.webp',
    ],
    features: [
      'Vented design for superior heat dissipation',
      'G3000 grey iron with uniform carbon distribution',
      'CNC-machined to ±0.01 mm runout tolerance',
      'Anti-rust coated hub and edges',
    ],
    categoryId: 'cat-2',
    rating: 4.5,
    reviewCount: 312,
    brand: 'ACDelco',
    deliveryDate: 'Mar 11',
  },
  {
    id: 'prod-206',
    name: 'ABS Sensor — Rear',
    price: 95.00,
    discountPrice: 79.90,
    currency: 'PEN',
    stock: 9,
    imageUrl: '/assets/images/products/brake-caliper.webp',
    images: [
      '/assets/images/products/brake-caliper.webp',
    ],
    features: [
      'Active magneto-resistive (AMR) sensing element',
      'Shielded wiring harness for EMI protection',
      'Plug-and-play OE connector — no splicing',
      'Operating range: −40 °C to +150 °C',
    ],
    categoryId: 'cat-2',
    rating: 4.0,
    reviewCount: 64,
    brand: 'Bosch',
    deliveryDate: 'Mar 7',
  },
];

/**
 * In-memory implementation of CatalogRepository for development and testing.
 * Provides hardcoded mock data for categories and products.
 */
export class InMemoryCatalogRepository implements CatalogRepository {
  /** @inheritdoc */
  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  }

  /** @inheritdoc */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
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
  async findByFilters(filters: FilterCriteria): Promise<Product[]> {
    let results = [...MOCK_PRODUCTS];

    // Filter by category slug
    if (filters.categorySlug) {
      const category = MOCK_CATEGORIES.find(
        (c) => c.slug === filters.categorySlug
      );
      if (category) {
        results = results.filter((p) => p.categoryId === category.id);
      } else {
        return [];
      }
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      results = results.filter(
        (p) => (p.discountPrice ?? p.price) >= filters.minPrice!
      );
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(
        (p) => (p.discountPrice ?? p.price) <= filters.maxPrice!
      );
    }

    // Filter by minimum rating
    if (filters.minRating !== undefined) {
      results = results.filter((p) => p.rating >= filters.minRating!);
    }

    // Filter by brands
    if (filters.brands && filters.brands.length > 0) {
      const brandSet = new Set(filters.brands.map((b) => b.toLowerCase()));
      results = results.filter((p) => brandSet.has(p.brand.toLowerCase()));
    }

    // Filter by availability
    if (filters.inStockOnly) {
      results = results.filter((p) => p.stock > 0);
    }

    // Sort
    switch (filters.sort) {
      case 'price_asc':
        results.sort(
          (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)
        );
        break;
      case 'price_desc':
        results.sort(
          (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)
        );
        break;
      case 'rating_desc':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In a real implementation this would sort by createdAt
        results.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'relevance':
      default:
        // Default order — no re-sorting
        break;
    }

    return results;
  }

  /** @inheritdoc */
  async getBrandsByCategory(categorySlug: string): Promise<string[]> {
    const category = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);
    if (!category) return [];

    const brands = MOCK_PRODUCTS
      .filter((p) => p.categoryId === category.id)
      .map((p) => p.brand);

    return [...new Set(brands)].sort();
  }

  /** @inheritdoc */
  async getProductById(id: string): Promise<Product | null> {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  /** @inheritdoc */
  async getAllBrands(): Promise<string[]> {
    const brands = MOCK_PRODUCTS.map((p) => p.brand);
    return [...new Set(brands)].sort();
  }
}
