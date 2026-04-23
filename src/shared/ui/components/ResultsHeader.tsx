import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

/**
 * Renders the breadcrumb navigation and result count header
 * for the product listing page.
 *
 * @remarks
 * Server component — the breadcrumb trail is built from props and rendered
 * inline, so the initial HTML already carries the nav. No client store,
 * no hydration flash.
 */
interface ResultsHeaderProps {
  /** Current locale code */
  locale: string;
  /** Localized category title */
  categoryTitle: string;
  /** Total number of matched results */
  totalResults: number;
  /** Localized labels */
  labels: {
    home: string;
    resultsCount: string;
  };
}

export function ResultsHeader({
  locale,
  categoryTitle,
  totalResults,
  labels,
}: ResultsHeaderProps) {
  const resultsText = labels.resultsCount.replace(
    "{count}",
    String(totalResults),
  );

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: labels.home, href: `/${locale}` },
    { label: categoryTitle },
  ];

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Breadcrumb items={breadcrumbItems} />

      {/* Result count */}
      <p className="text-xs text-foreground-muted sm:text-sm">{resultsText}</p>
    </div>
  );
}
