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
        className="flex-1 bg-transparent px-5 py-3 text-sm text-foreground outline-none placeholder:text-foreground/40"
      />
      <button
        type="submit"
        className="flex items-center justify-center bg-primary px-6 text-primary-foreground transition-colors hover:bg-primary/90"
        aria-label="Search"
      >
        {/* Magnifying glass icon (inline SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
      </button>
    </form>
  );
}
