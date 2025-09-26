# Stratocore Services - Frontend Exercise

A Vue.js e-commerce application built for the Stratocore frontend development exercise.

## Quick Start

**To run this application:**

```bash
git clone https://github.com/corentin-ltc/stratocore-vueJS.git
cd stratocore-vueJS
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Features

- Service catalog: Browse services organized by categories
- Shopping cart: Add/remove items with quantity management
- Dynamic pricing: Automatic discount application based on rules
- Responsive design: Works well on both mobile and desktop
- Real-time updates: Cart totals and savings update automatically

## Technology Stack

- Frontend Framework: Vue 3 (Composition API)
- State Management: Pinia
- Routing: Vue Router
- Language: TypeScript
- Build Tool: Vite
- Testing: Vitest + Playwright
- Code Quality: ESLint + Prettier

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppNavigation.vue
│   ├── Cart.vue
│   ├── CategoryList.vue
│   └── ServiceList.vue
├── stores/              # Pinia state management
│   ├── cart.ts         # Cart functionality
│   └── services.ts     # Data management
├── services/            # Data layer
│   └── dataService.ts  # API simulation
├── types/               # TypeScript definitions
├── views/               # Page components
└── data/               # Mock data files
```

## Key Implementation Details

### Discount System
The application implements a flexible discount system:
- Category-based discounts: Applied to all services in a category
- Service-specific discounts: Override category discounts when present
- Real-time calculation: Prices update automatically as items are added/removed

### State Management
- Pinia stores for reactive state management
- Computed properties for derived state (totals, savings)
- Persistent cart state during the session

### Data Architecture
- Singleton DataService for centralized data access
- TypeScript interfaces for type safety
- Mock JSON data simulating backend responses

## Configuration Files

- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.ts` - Linting rules
- `playwright.config.ts` - E2E testing setup

#

**Repository**: https://github.com/corentin-ltc/stratocore-vueJS
