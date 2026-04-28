import { ViewTransition, type ReactNode } from "react";

/**
 * Page-level wrapper that animates hierarchical navigations using React's
 * `<ViewTransition>` API. Picks `nav-forward` or `nav-back` based on the
 * transition type set by `<Link transitionTypes={[…]}>`.
 *
 * @remarks
 * - Wrap the **page** (not the layout). Layouts persist across navigations and
 *   never trigger enter/exit, so the type-keyed map would silently no-op.
 * - `default="none"` is critical — without it the wrapper would also fire
 *   during Suspense reveals, competing with the dedicated reveal VTs.
 * - The CSS for `.nav-forward` / `.nav-back` lives in `globals.css`
 *   (`::view-transition-*` recipes).
 */
export function DirectionalTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
