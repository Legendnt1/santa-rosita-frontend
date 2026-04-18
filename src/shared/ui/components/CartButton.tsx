"use client";

import Link from "next/link";
import { useCartStore, selectTotalItems } from "@/shared/stores/cart-store";
import { Icon } from "./Icon";

/**
 * Props for the CartButton component.
 */
interface CartButtonProps {
  locale: string;
  label: string;
}

/**
 * The CartButton component displays a shopping cart icon with a badge showing the total number of items in the cart.
 * It uses the `useCartStore` hook to access the total items count from the cart store. The badge animates when the count changes.
 * The button links to the cart page for the specified locale.
 */
export function CartButton({ locale, label }: CartButtonProps) {
  const totalItems = useCartStore(selectTotalItems);

  return (
    <Link
      href={`/${locale}/cart`}
      className="btn-icon relative"
      aria-label={label}
    >
      <Icon name="shopping-cart" className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
      {totalItems > 0 && (
        <span className="animate-scale-in absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
