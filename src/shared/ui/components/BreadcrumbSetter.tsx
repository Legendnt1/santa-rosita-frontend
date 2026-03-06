"use client";

import { useEffect } from "react";
import {
  useBreadcrumbStore,
  type BreadcrumbItem,
} from "@/shared/stores/breadcrumb-store";

interface BreadcrumbSetterProps {
  items: BreadcrumbItem[];
}

/**
 * Invisible client component that syncs the breadcrumb store
 * with the items determined by the server component page.
 *
 * Drop it anywhere in a page's JSX — it renders nothing.
 */
export function BreadcrumbSetter({ items }: BreadcrumbSetterProps) {
  const setItems = useBreadcrumbStore((s) => s.setItems);

  useEffect(() => {
    setItems(items);
  }, [items, setItems]);

  return null;
}
