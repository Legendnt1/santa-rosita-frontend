import Link from "next/link";
import { Icon } from "./Icon";

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Link URL — omit for the current/last item */
  href?: string;
}

interface BreadcrumbProps {
  /** Ordered trail; the last item renders as plain text (current page). */
  items: BreadcrumbItem[];
}

/**
 * Accessible breadcrumb navigation with chevron separators.
 *
 * @remarks
 * Pure server component — items are passed directly as props so the trail
 * is part of the initial HTML. Rendering on the server avoids the hydration
 * flash / CLS that a client-store-driven breadcrumb produces when the
 * initial render has no items, and keeps the trail available to crawlers.
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
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
                <Link
                  href={item.href}
                  transitionTypes={["nav-back"]}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
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
