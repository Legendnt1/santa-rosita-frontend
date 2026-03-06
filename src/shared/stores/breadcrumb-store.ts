import { create } from "zustand";

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Link URL — omit for the current/last item */
  href?: string;
}

interface BreadcrumbState {
  /** Current breadcrumb trail */
  items: BreadcrumbItem[];
  /** Replace the entire breadcrumb trail */
  setItems: (items: BreadcrumbItem[]) => void;
}

/**
 * Global breadcrumb store.
 * Pages set their trail via `setItems` and the `<Breadcrumb />`
 * component reads from it — no prop-drilling needed.
 */
export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
