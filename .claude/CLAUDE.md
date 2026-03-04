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
* **i18n**: Spanish (`es`), English (`en`), Chinese (`zh`) via `[locale]` route segments.
* **Fonts**: Local "Rubik" family stored in `public/assets/fonts/`.
* **Icons**: Local SVG sprite in `public/assets/icons/icons.svg`.

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

## Workflow & Tools
* **Environment**: Windows machine using **Warp Terminal**.
* **Version Control**: **Gitflow** workflow (feature -> develop -> master).
* **Quality**: Use **Zod** for data validation and ensure all repository ports are strictly typed.

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