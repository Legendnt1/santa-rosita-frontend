import { Icon } from "./Icon";

/**
 * Props for the SearchBar server component.
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
 * Search input with a magnifying-glass button.
 *
 * Native GET form that navigates to `/[locale]/catalog?q=…`.
 * Keeping it as a `<form method="get">` means it works without JS, stays a
 * Server Component, and browser history/back behaviour comes for free.
 */
export function SearchBar({ placeholder, locale, submitLabel = "Search" }: SearchBarProps) {
  return (
    <form
      method="get"
      action={`/${locale}/catalog`}
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
