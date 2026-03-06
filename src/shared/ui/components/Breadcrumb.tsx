"use client";

import { useBreadcrumbStore } from "@/shared/stores/breadcrumb-store";
import { Icon } from "./Icon";

/**
 * Accessible breadcrumb navigation with chevron separators.
 * Reads its trail from the global Zustand breadcrumb store.
 * The last item is rendered as plain text (current page).
 */
export function Breadcrumb() {
  const items = useBreadcrumbStore((s) => s.items);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-muted sm:text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <Icon
                  name="chevron-right"
                  className="h-3 w-3 text-foreground-muted/50"
                />
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              ) : (
                <span className={isLast ? "font-medium text-foreground" : ""}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
