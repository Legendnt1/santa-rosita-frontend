"use client";

import { useEffect, useState } from "react";

/**
 * Client-side theme toggle button.
 * Switches between light and dark themes by adding/removing
 * the `.dark` / `.light` class on `<html>` and persisting
 * the choice to localStorage.
 *
 * Uses sun/moon icons from the SVG sprite.
 *
 * @remarks
 * Initial state is always `"light"` to match the server render.
 * The real theme is resolved in a mount effect to avoid hydration mismatches.
 * The inline script in layout.tsx already sets the correct class on `<html>`
 * before paint, so there is no visual flash.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  /* Sync with localStorage / system preference after hydration */
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    setMounted(true);
  }, []);

  /* Apply class to <html> whenever theme changes (skip initial SSR value) */
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-8 w-8 items-center justify-center rounded-full text-navbar-fg transition-all duration-200 hover:bg-primary/15 hover:scale-110 active:scale-95 sm:h-9 sm:w-9"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? (
        <svg className="h-5 w-5 sm:h-5.5 sm:w-5.5" aria-hidden="true">
          <use href="/assets/icons/icons.svg#sun" />
        </svg>
      ) : (
        <svg className="h-5 w-5 sm:h-5.5 sm:w-5.5" aria-hidden="true">
          <use href="/assets/icons/icons.svg#moon" />
        </svg>
      )}
    </button>
  );
}
