/**
 * A single line-item persisted in the shopping cart.
 * Stores only what is needed for display and price calculation —
 * not the full Product domain entity.
 */
export interface CartItem {
  readonly productId: string;
  readonly name: string;
  readonly brand: string;
  readonly imageUrl: string;
  readonly price: number;
  readonly discountPrice?: number;
  readonly currency: string;
  quantity: number;
}

/**
 * Subset of Product fields required to add an item to the cart.
 * Kept serializable so it can cross the Server → Client boundary.
 */
export interface CartableProduct {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly imageUrl: string;
  readonly price: number;
  readonly discountPrice?: number;
  readonly currency: string;
  readonly stock: number;
}
