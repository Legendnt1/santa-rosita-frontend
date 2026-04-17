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
* **Fonts**: Local "Rubik" family stored in `public/assets/fonts/`.

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
* **Font Optimization**: Use `font-display: swap` and preload critical fonts for performance.
* **Icon Optimization**: Use SVG sprites to minimize HTTP requests and optimize rendering.

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

## Final Considerations
* **Using icons**: Use performance-optimized icon component `Icon.tsx` that uses the SVG sprite for all icons. Avoid inline SVGs or external icon libraries.
* **Running commands**: Do not execute 'build' or 'dev' commands for every change of code.