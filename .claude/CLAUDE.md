# Project Guidelines & Standards

## Role
Senior Software Engineer specializing in high-scale e-commerce platforms with a focus on maintainability, clear business boundaries, and internationalization.

## Project Overview: Corporación Santa Rosita
High-scale car parts e-commerce architecture designed for extreme maintainability and clear business boundaries.
* **Current Phase**: Phase 1 - Multi-language Product Catalog.
* **Future Phases**: User Accounts (Supabase), Delivery Logistics, and Financial Transactions.

## Tech Stack
* **Framework**: Next.js 16.1.6 (App Router).
* **Library**: React 19.2.4 (Focus on Server Components).
* **Styling**: Tailwind CSS 4.2.1 (Using `@theme inline` and CSS variables).
* **Language**: TypeScript 5.9.3 (Strict Mode).
* **State global**: Zustand (Minimal, only if necessary).
* **i18n**: Spanish (`es`), English (`en`), Chinese (`zh`) via `[locale]` route segments.
* **Fonts**: "Rubik" family via `next/font/google` (self-hosted, auto-preloaded). Configured in `src/app/[locale]/layout.tsx` with weights 400–800 + italic, exposed as `--font-rubik` and wired to `--font-sans` in `globals.css`.

## Architecture & Patterns
We follow a hybrid of **Screaming** and **Hexagonal Architecture** to ensure the core business logic remains framework-agnostic.

### 1. Screaming Architecture
Directories must be organized by domain, not technical type:
* `/src/modules/catalog`: All logic related to car parts.
* `/src/modules/auth`: (Phase 2) Identity management.

### 2. Hexagonal Architecture
Within each module:
* **Domain Layer**: Pure TypeScript. Zero dependencies. Contains Entities (e.g., `Part.ts`) and Repository Interfaces.
* **Application Layer**: Use cases and orchestration.
* **Infrastructure Layer**: Adapters for external services (Supabase, Fetch API, Mocks).

### 3. UX Design Patterns
* **Mobile-First**: Design for mobile screens first, then scale up.
* **Hierarchical Navigation**: Clear, intuitive navigation with breadcrumb support.
* **Progressive Disclosure**: Show only necessary information, with options to expand for details.
* **Consistent UI**: Use a shared component library for buttons, cards, forms, etc., ensuring a cohesive look and feel across the app.
* **Atomic Design**: Build UI with reusable components (Atoms, Molecules, Organisms).
* **Performance-First**: Prioritize server components and optimize bundle size.
* **Accessibility**: Follow WCAG guidelines, use semantic HTML, and ensure keyboard navigation.
* **Internationalization**: All text must be translatable, using i18n dictionaries and `[locale]` routing.
* **Font Optimization**: Fonts are loaded via `next/font` which self-hosts, subsets, preloads, and applies `font-display: swap` automatically. Do **not** add `<link rel="preload">` for fonts manually and do **not** add `@font-face` blocks in CSS.
* **Icon Optimization**: Use SVG sprites to minimize HTTP requests and optimize rendering.

### 4. Authentication (Phase 1 — Mock / Provisional)
> This layer is **provisional**. The JWT flow and cookie management will be replaced when the real API is integrated in Phase 2.

* Server Actions live in `src/app/[locale]/auth/actions.ts` (`"use server"`).
* `loginAction` and `registerAction` call their respective use cases, receive a `{ token, user }` response, and persist the token in an httpOnly cookie (`AUTH_COOKIE` / `COOKIE_OPTIONS` from `src/shared/lib/auth.ts`).
* `logoutAction` deletes the cookie.
* All actions return `ActionResult { error?: string; user?: User }` — errors are i18n key strings (e.g. `"auth.errors.invalidCredentials"`).
* The Navbar resolves the current user server-side via `getAuthToken()` + `authRepository.getProfile(token)` on every request.
* When the real API is ready: swap only the infrastructure adapter (`src/modules/auth/infrastructure/`) and update `COOKIE_OPTIONS` if needed — domain and application layers stay unchanged.

### 5. Scalability & Maintainability
* **Inicial Considerations**: This project is designed to be scalable and maintainable, with clear separation of concerns and modular architecture. As the project grows, we can easily add new features or modules without affecting existing functionality.
* **Future plans**: In future phases, we will integrate user accounts, delivery logistics, and financial transactions. The current architecture allows for seamless integration of these features without major refactoring.
* **Integration with a real managament system**: When integrating with a real management system, we will create new infrastructure adapters to connect to the external APIs. The domain and application layers will remain unchanged, ensuring that our core business logic is not affected by changes in the external systems.

## Coding Standards
* **Language**: All code, variable names, and JSDoc documentation must be in **ENGLISH**.
* **Naming Conventions**:
    * Files/Directories: `kebab-case` (e.g., `product-card.tsx`).
    * React Components: `PascalCase`.
    * Functions/Variables: `camelCase`.
* **Dependencies**: Maintain a "Lean" approach. Avoid external state management unless strictly necessary.
* **Styling**: Use the CSS variables defined in `globals.css` (e.g., `var(--color-primary)`).

## Structure
src/
  app/[locale]/             # Presentation
    /(shop)/                # Main shopping routes
    /auth/                  # Login/Register pages
    /cart/                  # Cart page
    /catalog/[slug]/        # Listing
    /catalog/product/[id]/  # Detail Page (PDP)
  modules/catalog/          # Business Logic
    /domain/                # Part entity (inc. features, images[])
    /application/           # get-product.use-case.ts
    /infrastructure/        # mock-repository.ts
  shared/ui/                # Atomic components (BuyBox, Gallery, StarRating)
  i18n/                     # es.json, en.json, zh.json

## Animation System (`globals.css`)
All animations are defined in `globals.css` via `@keyframes` + `@layer utilities`. Do **not** use external animation plugins (e.g. `tailwindcss-animate`).

### Animation utility classes
| Class | Keyframe | Duration | Use case |
|---|---|---|---|
| `.animate-fade-up` | `fade-up` | 350ms ease-out | Card/section entrance from below |
| `.animate-fade-in` | `fade-in` | 250ms ease-out | Image crossfade, backdrop overlay |
| `.animate-scale-in` | `scale-in` | 200ms cubic-bezier(0.16,1,0.3,1) | Dropdown menus, popups |
| `.animate-slide-in-left` | `slide-in-left` | 280ms cubic-bezier(0.32,0.72,0,1) | Mobile drawer/sidebar |

### Product grid stagger
Add the `.product-grid` class to the grid container. CSS `nth-child` selectors automatically delay each `article` child by 55ms increments (up to 8 items), creating a cascading entrance with zero JS.

```html
<div class="product-grid grid grid-cols-2 ...">
  <article class="animate-fade-up">...</article>  <!-- delay 0ms   -->
  <article class="animate-fade-up">...</article>  <!-- delay 55ms  -->
  <article class="animate-fade-up">...</article>  <!-- delay 110ms -->
</div>
```

### Shared component classes (`@layer components`)
Reusable classes that replace long Tailwind strings. Always prefer these over repeating the utility chain.

| Class | Description | Used in |
|---|---|---|
| `.btn-icon` | Round ghost icon button (navbar scale hover) | Navbar, ThemeToggle, LanguageSwitcher |
| `.btn-primary` | Full-width rounded-full primary button | BuyBox |
| `.btn-accent` | Full-width rounded-full accent/red button | BuyBox |
| `.btn-outline-primary` | Outline block button, fills on hover | ProductGrid (Ver producto) |
| `.card-interactive` | Card with border, shadow, and `hover:-translate-y-0.5` lift | ProductGrid listing cards |

### Rules
* New repeating UI patterns → add to `@layer components` in `globals.css`, not inline.
* New entrance animations → add `@keyframes` + utility to `@layer utilities`.
* `will-change: transform` is set on `.card-interactive` for GPU compositing. Add it manually to other elements only when a hover transform causes jank.
* Image crossfade: use `key={src}` on the `<img>` element so React remounts it and re-triggers the `animate-fade-in` class.

## Performance & Navigation Rules
* **Links**: Use `next/link` `<Link>` for **every internal navigation**. Never use plain `<a href="/…">` for in-app routes — it triggers a full page reload, caches the page in bfcache, and leaves React event handlers dead when the user navigates back. `<a>` is only allowed for external URLs, `href="#anchor"` jumps, or `href="mailto:/tel:"` links.
* **Images**: Use `next/image` `<Image>` everywhere. Declare explicit `width`/`height` for fixed-size images or `fill` + `sizes` for responsive containers. Set `priority` on the LCP candidate of each route. Never use raw `<img>`.
* **Bfcache safety**: Any client component that keeps open/close state for dropdowns or overlays with a full-viewport backdrop must register a `pageshow` listener that resets state when `event.persisted === true`. This prevents frozen-open panels from blocking clicks after browser back navigation.
* **Request-level dedup**: Repository adapter instances (e.g. `catalog-repository.instance.ts`) must wrap each read method in `React.cache(...)` so multiple server components in the same request share a single fetch.
* **Streaming**: Data-heavy page sections should be split into an async child component wrapped in `<Suspense fallback={...}>`, with the Navbar and shell rendering immediately outside the boundary. Skeletons must mirror the responsive column structure of the real grid.
* **Persisted stores**: Zustand stores persisted to `localStorage` must declare `version` and a `migrate` function. Drop incompatible payloads via `return { ...default } as unknown as Store` — actions are re-attached by Zustand after rehydration.

## Final Considerations
* **Using icons**: Use performance-optimized icon component `Icon.tsx` that uses the SVG sprite for all icons. Avoid inline SVGs or external icon libraries.
* **Running commands**: Do not execute 'build' or 'dev' commands for every change of code.
* **Important changes**: If you make important changes, like refactoring the architecture or changing the tech stack, update this document to reflect the new standards and guidelines. This ensures that all team members are aligned and can maintain consistency across the project.