"use client";

import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/shared/stores/cart-store";
import type { CartableProduct } from "@/modules/cart/domain/entities/CartItem";
import { Icon } from "./Icon";

/**
 * Props for the AddToCartSection component.
 */
interface AddToCartSectionProps {
  product: CartableProduct;
  labels: {
    quantity: string;
    addToCart: string;
    addedToCart: string;
    buyNow: string;
  };
}

/**
 * The AddToCartSection component provides a UI for adding a product to the cart. 
 * It includes a quantity selector, an "Add to Cart" button that shows a temporary success state when clicked, 
 * and a disabled "Buy Now" button for future implementation. 
 * The component uses the `useCartStore` hook to add items to the cart and manages local state for the 
 * quantity and success feedback.
 */
export function AddToCartSection({ product, labels }: AddToCartSectionProps) {
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isOutOfStock = product.stock <= 0;
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const handleAdd = () => {
    addItem(product, qty);
    setJustAdded(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Quantity selector */}
      {!isOutOfStock && (
        <div className="flex items-center gap-2">
          <label htmlFor="qty-select" className="text-sm font-medium text-card-foreground">
            {labels.quantity}:
          </label>
          <select
            id="qty-select"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}

      {/* Add to Cart */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={isOutOfStock}
        className={`btn-primary flex items-center justify-center gap-2 ${
          justAdded ? "bg-emerald-600! shadow-emerald-500/30!" : ""
        }`}
      >
        {justAdded ? (
          <>
            <Icon name="check" className="h-4 w-4" />
            {labels.addedToCart}
          </>
        ) : (
          labels.addToCart
        )}
      </button>

      {/* Buy Now — Phase 2 */}
      <button type="button" disabled className="btn-accent">
        {labels.buyNow}
      </button>
    </div>
  );
}
