'use client';

import { useRouter } from 'next/navigation';
import { Icon } from './Icon';

/**
 * Props for the SearchBar component.
 */
interface SearchBarProps {
  /** Localized placeholder text */
  placeholder: string;
  /** Locale used to target the search results route */
  locale: string;
  /** aria-label for the submit button */
  submitLabel?: string;
}

/**
 * Search input that navigates via `router.push()` instead of a native GET
 * form submission.
 *
 * @remarks
 * Using `router.push()` keeps the navigation inside the SPA history stack
 * so the source page is never put in bfcache. A native `<form method="get">`
 * triggers a full page reload, which suspends React's event listeners on the
 * previous page — causing the theme toggle, language switcher, and categories
 * dropdown to stop responding after the user presses the browser back button.
 *
 * The `role="search"` landmark and keyboard submit (Enter) are preserved.
 * Progressive enhancement (no-JS) is intentionally traded for bfcache safety.
 *
 * The React 19 `action` function prop receives a `FormData` directly —
 * no `FormEvent`, no `e.preventDefault()` needed.
 */
export function SearchBar({ placeholder, locale, submitLabel = 'Search' }: SearchBarProps) {
  const router = useRouter();

  function handleAction(formData: FormData) {
    const q = ((formData.get('q') as string) ?? '').trim();
    router.push(
      q
        ? `/${locale}/catalog?q=${encodeURIComponent(q)}`
        : `/${locale}/catalog`
    );
  }

  return (
    <form
      action={handleAction}
      role="search"
      className="flex w-full overflow-hidden rounded-full bg-card ring-1 ring-border transition-shadow focus-within:ring-2 focus-within:ring-primary/70"
    >
      <input
        type="search"
        name="q"
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        className="flex-1 bg-background-search-bar px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground-muted/70 sm:px-5 sm:py-3"
      />
      <button
        type="submit"
        className="flex shrink-0 items-center justify-center bg-primary px-4 text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95 sm:px-6"
        aria-label={submitLabel}
      >
        <Icon name="search" className="h-5 w-5 sm:h-5.5 sm:w-5.5" label={submitLabel} />
      </button>
    </form>
  );
}
