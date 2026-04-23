<div align="center">
  <a id="top"></a>
  <img src="public/assets/images/logo.webp" alt="Santa Rosita Logo" width="250" />

  # Santa Rosita E-Commerce Frontend

  ![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
  ![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38B2AC?logo=tailwind-css&logoColor=white)
  ![Zustand](https://img.shields.io/badge/Zustand-5.0-764ABC?logo=redux&logoColor=white)

  <p align="center">
    <em>A high-scale, production-oriented car parts e-commerce frontend designed to serve real corporate clients and handle real-world transactions. Built with extreme maintainability, clear business boundaries, and robust internationalization.</em>
  </p>
</div>

---

## <a id="table-of-contents"></a>Table of Contents
- [Important Security Notice](#security-notice)
- [Project Phases](#project-phases)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## <a id="security-notice"></a>Important Security Notice: Mock Authentication

> **CRITICAL WARNING:**
> **DO NOT USE THE CURRENT AUTHENTICATION IMPLEMENTATION IN PRODUCTION.**

As this project is currently in **Phase 1**, the authentication system is entirely *simulated*:

- JWTs are generated with fake, unencrypted signatures (`btoa("mock_sig_" + user.id)`).
- The `isAuthenticated` function only checks for the presence of a token and **does not validate the signature**.
- Hardcoded user credentials exist natively within the codebase.

> *This layer is intentionally mock-only and MUST be replaced with a real Identity Provider (like `Supabase`, `Firebase`, or your own secure backend) before utilizing this codebase for any real-world application or enterprise environment.*

---

## <a id="project-phases"></a>Project Phases

### Current Phase
* **Phase 1:** Multi-language Product Catalog and UI Foundation.
  * In-memory mock repositories for catalog and auth.
  * i18n support (`en`, `es`, `zh`).
  * Design system and performance-first architecture.

### Future Phases
* **Phase 2:** User Accounts & Identity. 
  * Real authentication integration (e.g., `Supabase`).
* **Phase 3:** Delivery Logistics.
  * Real-time shipping calculation and tracking logic.
* **Phase 4:** Financial Transactions.
  * Integration with real-world payment gateways.

---

## <a id="architecture"></a>Architecture

This repository strictly separates domain logic from infrastructure and frameworks:

> *"The architecture should scream the intent of the system, not the frameworks being used."* <br>
> — **Uncle Bob (Robert C. Martin)** on Screaming Architecture.

- **Domain Layer:** Pure TypeScript entities and repository interfaces. *Zero dependencies.*
- **Application Layer:** Use cases and orchestration.
- **Infrastructure Layer:** Adapters for external services (currently utilizing mocks).
- **Presentation Layer:** Next.js App Router handling SSR, streaming, and modular UI components.

---

## <a id="tech-stack"></a>Tech Stack

- **Framework:** Next.js `16.1` (App Router)
- **Library:** React `19.2` (Focus on Server Components)
- **Styling:** Tailwind CSS `4.2`
- **Language:** TypeScript `5.9` (Strict Mode)
- **State Management:** Zustand
- **Package Manager:** `pnpm`

---

## <a id="getting-started"></a>Getting Started

First, install the dependencies using the designated package manager:

```bash
pnpm install
```

Then, run the development server locally:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the running instance.

---

## <a id="contributing"></a>Contributing

Contributions are highly welcomed. Please feel free to submit a Pull Request. Any improvements to architectural patterns, accessibility, security, and caching performance are greatly appreciated since this is a real-world enterprise platform.

---

## <a id="license"></a>License

This project is open-sourced under the [MIT License](LICENSE).

