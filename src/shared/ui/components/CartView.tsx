"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, selectTotalPrice } from "@/shared/stores/cart-store";
import { formatPrice } from "@/shared/utils/price";
import { Icon } from "./Icon";

/**
 * Props for the CartView component.
 */
interface CartViewProps {
  locale: string;
  labels: {
    title: string;
    empty: string;
    emptySubtitle: string;
    continueShopping: string;
    remove: string;
    orderSummary: string;
    subtotal: string;
    shipping: string;
    shippingNote: string;
    total: string;
    checkout: string;
    clear: string;
    qty: string;
    items: string;
    decreaseQty: string;
    increaseQty: string;
  };
}

/**
 * The CartView component displays the contents of the shopping cart. 
 * It shows a list of items in the cart with their details, allows users to update quantities or remove items, 
 * and provides an order summary with the total price. If the cart is empty, it shows a message and a link to 
 * continue shopping. The component uses the `useCartStore` hook to access the cart state and actions, 
 * and it formats prices using the `formatPrice` utility function.
 */
export function CartView({ locale, labels }: CartViewProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore(selectTotalPrice);

  const currency = items[0]?.currency ?? "PEN";
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24 text-center animate-fade-in-up">
        <Icon name="shopping-cart" className="h-16 w-16 text-foreground-muted/40" />
        <div>
          <p className="text-xl font-bold text-card-foreground">{labels.empty}</p>
          <p className="mt-1 text-sm text-foreground-muted">{labels.emptySubtitle}</p>
        </div>
        <Link href={`/${locale}/catalog`} className="btn-primary max-w-xs">
          {labels.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-card-foreground sm:text-3xl">
            {labels.title}
          </h1>
          <p className="text-sm text-foreground-muted">
            {labels.items.replace("{count}", String(totalItems))}
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-foreground-muted underline-offset-2 transition-colors hover:text-accent hover:underline"
        >
          {labels.clear}
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ── Item list ──────────────────────────────────── */}
        <div className="flex flex-col gap-3 lg:flex-1">
          {items.map((item) => {
            const effectivePrice = item.discountPrice ?? item.price;
            const itemTotal = effectivePrice * item.quantity;
            return (
              <div key={item.productId} className="card flex gap-3 p-3 sm:gap-4 sm:p-4 animate-fade-in-up">
                {/* Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border/40 bg-white sm:h-24 sm:w-24">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-contain p-1"
                  />
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {item.brand}
                  </p>
                  <p className="line-clamp-2 text-sm font-medium text-card-foreground">
                    {item.name}
                  </p>

                  {/* Price row */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-card-foreground">
                      {formatPrice(item.currency, effectivePrice)}
                    </span>
                    {item.discountPrice !== undefined && (
                      <span className="text-xs text-foreground-muted line-through">
                        {formatPrice(item.currency, item.price)}
                      </span>
                    )}
                  </div>

                  {/* Controls row */}
                  <div className="mt-1 flex items-center gap-3">
                    {/* Qty stepper */}
                    <div className="flex items-center rounded-full border border-border/60 bg-background">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"
                        aria-label={labels.decreaseQty}
                      >
                        <Icon name="minus" className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold text-card-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none text-foreground-muted transition-colors hover:bg-primary/10 hover:text-primary"
                        aria-label={labels.increaseQty}
                      >
                        <Icon name="plus" className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Item subtotal */}
                    <span className="text-xs text-foreground-muted">
                      = {formatPrice(item.currency, itemTotal)}
                    </span>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="ml-auto flex items-center gap-1 text-xs text-foreground-muted/70 transition-colors hover:text-accent"
                      aria-label={labels.remove}
                    >
                      <Icon name="x" className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{labels.remove}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Order summary ──────────────────────────────── */}
        <div className="card p-4 sm:p-5 lg:w-72 lg:shrink-0 xl:w-80 animate-fade-in-up">
          <h2 className="mb-4 text-base font-bold text-card-foreground">
            {labels.orderSummary}
          </h2>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-muted">{labels.subtotal}</span>
              <span className="font-semibold text-card-foreground">
                {formatPrice(currency, totalPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">{labels.shipping}</span>
              <span className="text-foreground-muted italic">{labels.shippingNote}</span>
            </div>
          </div>

          <div className="my-4 border-t border-border/40" />

          <div className="mb-4 flex justify-between text-base font-bold">
            <span className="text-card-foreground">{labels.total}</span>
            <span className="text-primary">{formatPrice(currency, totalPrice)}</span>
          </div>

          <button type="button" disabled className="btn-primary mb-3">
            {labels.checkout}
          </button>

          <Link
            href={`/${locale}/catalog`}
            className="block text-center text-xs text-foreground-muted underline-offset-2 hover:text-primary hover:underline"
          >
            {labels.continueShopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
