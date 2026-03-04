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
    catalog: string;
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
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-xs text-foreground-muted sm:text-sm">
          <li>
            <a
              href={`/${locale}`}
              className="transition-colors hover:text-primary"
            >
              {labels.home}
            </a>
          </li>
          <li aria-hidden="true">
            <svg className="h-3 w-3 text-foreground-muted/50">
              <use href="#icon-chevron-right" />
            </svg>
          </li>
          <li>
            <span className="transition-colors hover:text-primary">
              {labels.catalog}
            </span>
          </li>
          <li aria-hidden="true">
            <svg className="h-3 w-3 text-foreground-muted/50">
              <use href="#icon-chevron-right" />
            </svg>
          </li>
          <li>
            <span className="font-medium text-foreground">{categoryTitle}</span>
          </li>
        </ol>
      </nav>

      {/* Result count */}
      <p className="text-xs text-foreground-muted sm:text-sm">
        {resultsText}
      </p>
    </div>
  );
}
