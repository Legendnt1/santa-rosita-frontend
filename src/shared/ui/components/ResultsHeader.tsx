import { Breadcrumb } from "./Breadcrumb";
import { BreadcrumbSetter } from "./BreadcrumbSetter";

/**
 * Renders the breadcrumb navigation and result count header
 * for the product listing page.
 * React 19 Server Component.
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
    '{count}',
    String(totalResults)
  );

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <BreadcrumbSetter
        items={[
          { label: labels.home, href: `/${locale}` },
          { label: categoryTitle },
        ]}
      />
      <Breadcrumb />

      {/* Result count */}
      <p className="text-xs text-foreground-muted sm:text-sm">
        {resultsText}
      </p>
    </div>
  );
}
