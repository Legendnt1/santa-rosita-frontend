import type { Product } from "@/modules/catalog/domain/entities/Product";
import {
  getEffectivePrice,
  hasDiscount as checkDiscount,
  getSavingsAmount,
  getDiscountPercent,
  formatPrice,
  formatDeliveryText,
} from "@/shared/utils/price";
import { Icon } from "./Icon";
import { StockBadge } from "./StockBadge";
import { AddToCartSection } from "./AddToCartSection";

/**
 * Props for the BuyBox server component.
 */
interface BuyBoxProps {
  /** Product data */
  product: Product;
  /** Localized PDP labels */
  labels: {
    inStock: string;
    outOfStock: string;
    onlyXLeft: string;
    price: string;
    listPrice: string;
    youSave: string;
    quantity: string;
    addToCart: string;
    addedToCart: string;
    buyNow: string;
    deliverTo: string;
    delivery: string;
    secureTransaction: string;
    soldBy: string;
    storeName: string;
    returnPolicy: string;
  };
}

/**
 * Amazon-inspired Buy Box — right-column panel on the PDP.
 * Shows price, stock, delivery info, and action buttons.
 *
 * @remarks
 * "Add to Cart" and "Buy Now" are rendered but **disabled** for Phase 1.
 * React 19 Server Component — zero client JS.
 */
export function BuyBox({ product, labels }: BuyBoxProps) {
  const effectivePrice = getEffectivePrice(product);
  const productHasDiscount = checkDiscount(product);
  const isOutOfStock = product.stock <= 0;
  const deliveryText = formatDeliveryText(labels.delivery, product.deliveryDate);
  const savingsAmount = getSavingsAmount(product);
  const savingsPercent = getDiscountPercent(product);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm sm:p-5">
      {/* ── Price ────────────────────────────────────────── */}
      <div>
        {productHasDiscount && (
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs text-foreground-muted">
              {labels.listPrice}:
            </span>
            <span className="text-sm text-foreground-muted line-through">
              {formatPrice(product.currency, product.price)}
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-card-foreground sm:text-3xl">
            {formatPrice(product.currency, effectivePrice)}
          </span>
        </div>
        {productHasDiscount && (
          <p className="mt-1 text-sm text-emerald-600">
            {labels.youSave}: {formatPrice(product.currency, savingsAmount)} (
            {savingsPercent}%)
          </p>
        )}
      </div>

      {/* ── Delivery ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 border-t border-border/30 pt-3">
        <p className="text-sm text-card-foreground">
          <Icon name="check" className="mr-1 inline h-3.5 w-3.5 text-emerald-500" />
          {deliveryText}
        </p>
        <p className="flex items-center gap-1 text-xs text-foreground-muted">
          <Icon name="map-pin" className="h-3.5 w-3.5" />
          {labels.deliverTo}
        </p>
      </div>

      {/* ── Stock ────────────────────────────────────────── */}
      <div className="border-t border-border/30 pt-3">
        <StockBadge
          stock={product.stock}
          labels={{
            inStock: labels.inStock,
            outOfStock: labels.outOfStock,
            onlyXLeft: labels.onlyXLeft,
          }}
        />
      </div>

      {/* ── Add to cart ──────────────────────────────────── */}
      <AddToCartSection
        product={{
          id: product.id,
          name: product.name,
          brand: product.brand,
          imageUrl: product.images[0] ?? "",
          price: product.price,
          discountPrice: product.discountPrice,
          currency: product.currency,
          stock: product.stock,
        }}
        labels={{
          quantity: labels.quantity,
          addToCart: labels.addToCart,
          addedToCart: labels.addedToCart,
          buyNow: labels.buyNow,
        }}
      />

      {/* ── Trust signals ────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 border-t border-border/30 pt-3 text-xs text-foreground-muted">
        <p className="flex items-center gap-1.5">
          <Icon name="lock" className="h-3.5 w-3.5 text-foreground-muted/70" />
          {labels.secureTransaction}
        </p>
        <p>
          <span className="text-foreground-muted/70">{labels.soldBy}</span>{" "}
          <span className="font-medium text-primary">{labels.storeName}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <Icon name="refresh" className="h-3.5 w-3.5 text-foreground-muted/70" />
          {labels.returnPolicy}
        </p>
      </div>
    </div>
  );
}
