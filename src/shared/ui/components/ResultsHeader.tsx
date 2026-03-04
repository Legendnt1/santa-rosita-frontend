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
            <svg className="h-3 w-3 text-foreground-muted/50" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <span className="transition-colors hover:text-primary">
              {labels.catalog}
            </span>
          </li>
          <li aria-hidden="true">
            <svg className="h-3 w-3 text-foreground-muted/50" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
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
