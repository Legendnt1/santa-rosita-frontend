import { SPRITE_ICONS_PATH } from "@/shared/utils/paths";


interface IconProps {
  /** Icon ID from the SVG sprite (e.g. "search", "star-full") */
  name: string;
  /** Tailwind classes for sizing, color, etc. */
  className?: string;
  /** Accessible label — omit for decorative icons (sets aria-hidden) */
  label?: string;
}

/**
 * Renders an icon from the local SVG sprite sheet.
 * Reduces the boilerplate of writing `<svg><use href="..." /></svg>` everywhere.
 *
 * @example
 * <Icon name="search" className="h-5 w-5 text-primary" />
 * <Icon name="lock" className="h-4 w-4" label="Secure" />
 */
export function Icon({ name, className, label }: IconProps) {
  return (
    <svg
      className={className}
      aria-hidden={!label}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      <use href={`${SPRITE_ICONS_PATH}#${name}`} />
    </svg>
  );
}
