import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import { getDictionary } from '@/i18n/getDictionary';
import { GetProductById } from '@/modules/catalog/application/get-product-by-id.use-case';
import { catalogRepository } from '@/modules/catalog/infrastructure/catalog-repository.instance';
import { ImageGallery } from '@/shared/ui/components/ImageGallery';
import { BuyBox } from '@/shared/ui/components/BuyBox';
import { Breadcrumb, type BreadcrumbItem } from '@/shared/ui/components/Breadcrumb';
import { DirectionalTransition } from '@/shared/ui/components/DirectionalTransition';
import {
  getEffectivePrice,
  hasDiscount as checkDiscount,
  getDiscountPercent,
  formatPrice,
} from '@/shared/utils/price';
import { interpolate } from '@/shared/utils/template';
import { notFound } from 'next/navigation';
import { StarRating } from '@/shared/ui/components/StarRating';



/**
 * Product Detail Page (PDP).
 * Server Component — fetches product data via the GetProductById use case.
 *
 * Route: /[locale]/catalog/product/[id]
 *
 * Layout:
 * - Desktop (lg+): 3-column — Gallery | Info | BuyBox
 * - Mobile: stacked — Gallery → Info → BuyBox
 */
interface ProductDetailPageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

/**
 * Metadata for a product detail page.
 *
 * @remarks
 * Fetches the product and dictionary in parallel. When the product does
 * not exist we return an empty object so the page's `notFound()` path
 * takes over without Next.js rendering a misleading stale title. The
 * primary image is surfaced via `openGraph.images` so social shares
 * render a proper product card.
 */
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const useCase = new GetProductById(catalogRepository);

  const [dict, product] = await Promise.all([
    getDictionary(locale),
    useCase.execute(id),
  ]);

  if (!product) return {};

  const values = {
    name: product.name,
    brand: product.brand,
    store: dict.pdp.storeName,
    feature: product.features[0] ?? "",
  };
  const title = interpolate(dict.meta.product.title, values);
  const description = interpolate(dict.meta.product.description, values);
  const ogAlt = interpolate(dict.meta.product.ogAlt, { name: product.name });

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/catalog/product/${product.id}` },
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      images: product.imageUrl
        ? [{ url: product.imageUrl, alt: ogAlt }]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, id } = await params;

  // ── Parallel data fetching ────────────────────────────────
  const useCase = new GetProductById(catalogRepository);

  const [dict, product] = await Promise.all([
    getDictionary(locale),
    useCase.execute(id),
  ]);

  if (!product) notFound();

  // ── Resolve category for breadcrumb ───────────────────────
  const categories = await catalogRepository.getCategories();
  const category = categories.find((c: { id: string }) => c.id === product.categoryId);
  const categoryTitle = category
    ? (dict.catalog[category.slug]?.title ?? category.slug)
    : '';
  const categorySlug = category?.slug ?? '';

  const pdp = dict.pdp;
  const effectivePrice = getEffectivePrice(product);
  const productHasDiscount = checkDiscount(product);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: pdp.breadcrumbHome, href: `/${locale}` },
    ...(category
      ? [{ label: categoryTitle, href: `/${locale}/catalog/${categorySlug}` }]
      : []),
    { label: pdp.breadcrumbProduct },
  ];

  return (
    <DirectionalTransition>
      {/* ── Breadcrumbs ──────────────────────────────────── */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* ── 3-column PDP layout ─────────────────────────── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">

          {/* ─── Left: Image Gallery ───────────────────────── */}
          <div className="w-full lg:w-[42%] xl:w-[45%]">
            <ImageGallery
              images={product.images}
              productName={product.name}
              productId={product.id}
              viewImageLabel={pdp.viewImage}
            />
          </div>

          {/* ─── Center: Product Info ──────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="text-xl font-bold leading-tight text-foreground sm:text-2xl">
              {product.name}
            </h1>

            {/* Brand */}
            <p className="mt-1 text-sm text-foreground-muted">
              <span>{pdp.brand}: </span>
              <a href="#" className="text-primary hover:underline">
                {product.brand}
              </a>
            </p>

            {/* Rating */}
            <div className="mt-2">
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                reviewsLabel={pdp.reviews}
                ratingLabel={pdp.ratingLabel}
              />
            </div>

            {/* Divider */}
            <hr className="my-3 border-border/40" />

            {/* Price block (visible on mobile, hidden on lg where BuyBox shows it) */}
            <div className="lg:hidden">
              <div className="flex items-baseline gap-2">
                {productHasDiscount && (
                  <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-accent-foreground">
                    -{getDiscountPercent(product)}%
                  </span>
                )}
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(product.currency, effectivePrice)}
                </span>
              </div>
              {productHasDiscount && (
                <p className="mt-0.5 text-sm text-foreground-muted">
                  {pdp.listPrice}:{' '}
                  <span className="line-through">
                    {formatPrice(product.currency, product.price)}
                  </span>
                </p>
              )}
              <hr className="my-3 border-border/40" />
            </div>

            {/* Features — "About this item" */}
            {product.features.length > 0 && (
              <div>
                <h2 className="mb-2 text-base font-bold text-foreground">
                  {pdp.aboutThisItem}
                </h2>
                <ul className="flex flex-col gap-1.5 pl-5">
                  {product.features.map((feature, i) => (
                    <li
                      key={`feat-${i}`}
                      className="list-disc text-sm leading-relaxed text-foreground/85"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ─── Right: Buy Box ────────────────────────────── */}
          <div className="w-full shrink-0 lg:w-60 xl:w-72">
            <BuyBox
              product={product}
              labels={{
                inStock: pdp.inStock,
                outOfStock: pdp.outOfStock,
                onlyXLeft: pdp.onlyXLeft,
                price: pdp.price,
                listPrice: pdp.listPrice,
                youSave: pdp.youSave,
                quantity: pdp.quantity,
                addToCart: pdp.addToCart,
                addedToCart: dict.cart.addedToCart,
                buyNow: pdp.buyNow,
                deliverTo: pdp.deliverTo,
                delivery: pdp.delivery,
                secureTransaction: pdp.secureTransaction,
                soldBy: pdp.soldBy,
                storeName: pdp.storeName,
                returnPolicy: pdp.returnPolicy,
              }}
            />
          </div>
      </div>
    </DirectionalTransition>
  );
}
