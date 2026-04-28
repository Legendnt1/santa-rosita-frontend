import { forwardRef, memo, SVGProps } from "react";

/** Union type of all available icons in public/assets/icons/icons.svg 
 * Add new icon IDs here to maintain strict type safety across the app.
 */
export type IconName = 
  | "alert-triangle"
  | "caret-down"
  | "caret-up"
  | "check"
  | "chevron-down"
  | "chevron-right"
  | "filter"
  | "heart"
  | "home"
  | "location"
  | "lock"
  | "mail"
  | "map-pin"
  | "menu-2"
  | "message"
  | "moon"
  | "pencil"
  | "phone"
  | "refresh"
  | "search"
  | "share"
  | "shopping-cart"
  | "star-empty"
  | "star-full"
  | "star-half"
  | "sun"
  | "trash"
  | "user"
  | "world"
  | "x"
  | "minus"
  | "plus"
  | "brand-whatsapp"
  | "brand-instagram"
  | "brand-x-twitter"
  | "brand-facebook"

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  /** Icon ID from the SVG sprite. Ensures developers only use existing icons. */
  name: IconName;
  /** Tailwind classes for sizing and color. Defaults to current color and standard size. */
  className?: string;
  /** Accessible label for screen readers. Omit for decorative icons. */
  label?: string;
}

/**
 * Performance-optimized Icon component referencing the inline SVG sprite.
 *
 * @remarks
 * The sprite is rendered once at the top of `<body>` by `<SpriteSheet />`
 * in the root layout. Each `<use href="#name">` resolves to a same-document
 * `<symbol>`, so no HTTP request is ever made for icons — not even a
 * 304-revalidation. Memoized to prevent re-renders in large product lists.
 *
 * @example
 * <Icon name="star-full" className="size-4 text-accent" label="4 stars" />
 */
export const Icon = memo(
  forwardRef<SVGSVGElement, IconProps>(
    ({ name, className = "size-5", label, ...props }, ref) => {
      const isDecorative = !label;

      return (
        <svg
          {...props}
          ref={ref}
          className={className}
          aria-hidden={isDecorative}
          aria-label={label}
          role={isDecorative ? undefined : "img"}
          // Ensures the icon inherits the current text color by default
          fill="currentColor"
        >
          <use href={`#${name}`} />
        </svg>
      );
    }
  )
);

Icon.displayName = "Icon";