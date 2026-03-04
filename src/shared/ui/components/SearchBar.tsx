/**
 * Props for the SearchBar server component.
 */
interface SearchBarProps {
  /** Localized placeholder text */
  placeholder: string;
}

/**
 * Search input with a magnifying-glass button.
 * Renders the search bar as shown in the navbar mockup.
 * React 19 Server Component (form submission handled server-side or via action).
 */
export function SearchBar({ placeholder }: SearchBarProps) {
  return (
    <form
      className="flex w-full overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-border"
      action="#"
    >
      <input
        type="search"
        name="q"
        placeholder={placeholder}
        className="flex-1 bg-background-search-bar px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground-muted sm:px-5 sm:py-3"
      />
      <button
        type="submit"
        className="flex items-center justify-center bg-primary px-4 text-primary-foreground transition-colors hover:bg-primary/90 sm:px-6"
        aria-label="Search"
      >
        <svg className="h-5 w-5 sm:h-5.5 sm:w-5.5" aria-hidden="true">
          <use href="/assets/icons/icons.svg#search" />
        </svg>
      </button>
    </form>
  );
}
