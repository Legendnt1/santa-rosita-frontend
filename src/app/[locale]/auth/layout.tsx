import type { ReactNode } from "react";

/**
 * Authentication layout component that wraps the login and registration pages.
 * It provides a consistent layout and styling for all authentication-related pages, such as login and registration.
 * The layout centers the content on the page and includes a background color and padding for better aesthetics.
 * This component is used as a wrapper for the login and registration pages to ensure a cohesive user experience across all authentication screens. 
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {children}
    </div>
  );
}
