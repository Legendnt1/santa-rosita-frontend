import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartableProduct } from '@/modules/cart/domain/entities/CartItem';

/**
 * CartState defines the shape of the cart's state, which includes an array of CartItem objects representing 
 * the items currently in the cart.
 */
interface CartState {
  items: CartItem[];
}

/**
 * The cart store manages the state of the shopping cart, including the list of items and actions to modify the cart.
 * It uses Zustand for state management and persists the cart state in local storage under the key 'cart-storage'.
 * The store provides actions to add items, remove items, update item quantities, and clear the cart.
 */
interface CartActions {
  addItem: (product: CartableProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

/**
 * CartStore combines the CartState and CartActions interfaces to define the complete shape of the cart store.
 * The `useCartStore` hook can be used in React components to access the cart state and actions.
 */
export type CartStore = CartState & CartActions;


/**
 * The `useCartStore` hook provides access to the cart store, which manages the shopping cart state and actions.
 * The store is created using Zustand and is persisted in local storage under the key 'cart-storage'.
 * It includes actions to add items to the cart, remove items, update item quantities, and clear the cart.
 * The `addItem` action checks if the product already exists in the cart and updates the quantity accordingly, ensuring it does not exceed the product's stock.
 * The `removeItem` action removes an item from the cart based on its product ID.
 * The `updateQuantity` action updates the quantity of a specific item, removing it if the quantity is set to zero or less.
 * The `clearCart` action empties the cart by setting the items array to an empty array.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            };
          }

          const item: CartItem = {
            productId: product.id,
            name: product.name,
            brand: product.brand,
            imageUrl: product.imageUrl,
            price: product.price,
            discountPrice: product.discountPrice,
            currency: product.currency,
            quantity: Math.min(quantity, product.stock),
          };

          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
);

/** Total number of units across all cart items. */
export const selectTotalItems = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);

/** Total price using effective (discounted) price per item. */
export const selectTotalPrice = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + (i.discountPrice ?? i.price) * i.quantity, 0);
