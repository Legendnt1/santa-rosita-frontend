import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { GetProductById } from '@/modules/catalog/application/get-product-by-id.use-case';
import { InMemoryCatalogRepository } from '@/modules/catalog/infrastructure/adapters/InMemoryCatalogRepository';
import { Navbar } from '@/shared/ui/components/Navbar';
import { ImageGallery } from '@/shared/ui/components/ImageGallery';
import { BuyBox } from '@/shared/ui/components/BuyBox';
import { notFound } from 'next/navigation';

/**
 * Star rating display used in the product info column.
 */
function StarRating({
  rating,
  reviewCount,
  reviewsLabel,
}: {
  rating: number;
  reviewCount: number;
  reviewsLabel: string;
}) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const text = reviewsLabel.replace('{count}', String(reviewCount));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="font-semibold text-sm text-card-foreground">
        {rating.toFixed(1)}
      </span>
      <span className="flex items-center" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: fullStars }, (_, i) => (
          <svg key={`f${i}`} className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalf && (
          <svg className="h-4 w-4 text-amber-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="pdpHalfStar">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path fill="url(#pdpHalfStar)" stroke="currentColor" strokeWidth="0.5" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <svg key={`e${i}`} className="h-4 w-4 text-foreground-muted/25" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      <a href="#reviews" className="text-sm text-primary hover:underline">
        {text}
      </a>
    </div>
  );
}

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
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  // ── Parallel data fetching ────────────────────────────────
  const repository = new InMemoryCatalogRepository();
  const useCase = new GetProductById(repository);

  const [dict, product] = await Promise.all([
    getDictionary(locale as Locale),
    useCase.execute(id),
  ]);

  if (!product) notFound();

  // ── Resolve category for breadcrumb ───────────────────────
  const categories = await repository.getCategories();
  const category = categories.find((c) => c.id === product.categoryId);
  const categoryTitle = category
    ? (dict.catalog[category.slug]?.title ?? category.slug)
    : '';
  const categorySlug = category?.slug ?? '';

  const pdp = dict.pdp;
  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== undefined;

  return (
    <>
      <Navbar dict={dict} locale={locale} />

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        {/* ── Breadcrumbs ──────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-muted sm:text-sm">
            <li>
              <a
                href={`/${locale}`}
                className="transition-colors hover:text-primary"
              >
                {pdp.breadcrumbHome}
              </a>
            </li>
            <li aria-hidden="true">
              <svg className="h-3 w-3 text-foreground-muted/50" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </li>
            {category && (
              <>
                <li>
                  <a
                    href={`/${locale}/catalog/${categorySlug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {categoryTitle}
                  </a>
                </li>
                <li aria-hidden="true">
                  <svg className="h-3 w-3 text-foreground-muted/50" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </li>
              </>
            )}
            <li>
              <span className="font-medium text-foreground">
                {pdp.breadcrumbProduct}
              </span>
            </li>
          </ol>
        </nav>

        {/* ── 3-column PDP layout ─────────────────────────── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">

          {/* ─── Left: Image Gallery ───────────────────────── */}
          <div className="w-full lg:w-[42%] xl:w-[45%]">
            <ImageGallery images={product.images} productName={product.name} />
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
              />
            </div>

            {/* Divider */}
            <hr className="my-3 border-border/40" />

            {/* Price block (visible on mobile, hidden on lg where BuyBox shows it) */}
            <div className="lg:hidden">
              <div className="flex items-baseline gap-2">
                {hasDiscount && (
                  <span className="rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-accent-foreground">
                    -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
                  </span>
                )}
                <span className="text-2xl font-bold text-foreground">
                  {product.currency} {effectivePrice.toFixed(2)}
                </span>
              </div>
              {hasDiscount && (
                <p className="mt-0.5 text-sm text-foreground-muted">
                  {pdp.listPrice}:{' '}
                  <span className="line-through">
                    {product.currency} {product.price.toFixed(2)}
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
      </main>
    </>
  );
}
