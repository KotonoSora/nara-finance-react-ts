---
applyTo: '**/*.{ts,tsx}'
---

# Clean Architecture for React/TypeScript

When implementing frontend applications, follow these Clean Architecture principles to ensure maintainability, scalability, and separation of concerns. This rule is tailored for React/TypeScript applications with feature-based organization.

## 1. Application Structure

- The application **must** be organized into clear layers within each feature:
  - `app/features/[feature]/domain/` (core business logic, entities, value objects, domain events)
  - `app/features/[feature]/application/` (use cases, commands, queries, hooks for business logic)
  - `app/features/[feature]/infrastructure/` (external API calls, data access, third-party integrations)
  - `app/features/[feature]/components/` (UI components, presentation layer)
- Shared components and utilities should be in:
  - `app/components/` (shared UI components)
  - `app/lib/` (shared utilities, configurations)
  - `app/hooks/` (shared custom hooks)
- Tests must be co-located with their respective modules:
  - `app/features/[feature]/**/*.test.{ts,tsx}` (unit tests)
  - `app/routes/**/*.test.{ts,tsx}` (integration tests for routes)

## 2. Dependencies Between Layers

- **Domain**: has no dependencies on other layers (pure TypeScript/business logic).
- **Application**: depends only on **Domain** (custom hooks, use cases).
- **Infrastructure**: depends on **Application** and **Domain** (API clients, data fetching).
- **Components**: depends on **Application** and **Domain** (UI components, forms).
- **Routes**: can depend on all layers but should primarily use **Application** layer.
- These dependencies **should** be enforced by import restrictions and code reviews.
- Forbidden dependencies: Domain should never import from React, external APIs, or UI libraries.

## 3. Folder and File Structure

- Use a **feature-oriented** (domain-driven) folder structure (e.g., `finance/`, `transactions/`, `accounts/`).
- Do **not** use technical root folders (Components, Hooks, Services, etc.) at the feature level.
- Example structure:

```
app/
  features/
    finance/
      domain/
        entities/
          Transaction.ts
          Account.ts
        value-objects/
          Money.ts
          Currency.ts
        events/
          TransactionCreated.ts
      application/
        use-cases/
          CreateTransactionUseCase.ts
          GetAccountBalanceUseCase.ts
        hooks/
          useTransactions.ts
          useAccount.ts
        services/
          TransactionService.ts
      infrastructure/
        repositories/
          TransactionRepository.ts
          AccountRepository.ts
        clients/
          FinanceApiClient.ts
      components/
        TransactionForm.tsx
        AccountBalance.tsx
        TransactionList.tsx
      types/
        index.ts
  components/ (shared UI components)
    ui/
      Button.tsx
      Input.tsx
      Card.tsx
  lib/ (shared utilities)
    utils.ts
    validations.ts
  hooks/ (shared hooks)
    useLocalStorage.ts
  routes/
    finance.tsx
    transactions.tsx
```

## 4. Coding Style and Conventions

- Use TypeScript strict mode and modern ES6+ features.
- One primary export per file (component, hook, or service).
- Follow React and TypeScript best practices.
- Use functional components with hooks.
- Organize imports: React imports first, then third-party, then internal imports.
- Use absolute imports with path aliases (`~` for root, feature-relative imports within features).

## 5. Implementation Guidelines

- **Domain Layer**: Pure TypeScript business logic, entities, value objects, and domain events. No React, UI, or external dependencies.
- **Application Layer**: Custom hooks, use cases, business services. Can use React hooks but no UI components.
- **Infrastructure Layer**: API clients, data fetching, external service integrations. Can use fetch, external libraries.
- **Components Layer**: React components, forms, UI logic. Should consume Application layer through hooks.
- **Routes Layer**: React Router routes, page-level components. Orchestrates components and application logic.
- Use React Context or state management for cross-feature state sharing.
- Avoid prop drilling by using appropriate state management patterns.
- Use dependency injection pattern through React Context for services.

## 6. Testing and Architecture Validation

- **Unit Tests**: Co-located with modules, for Domain and Application layers. Use Vitest and appropriate mocking libraries.
- **Component Tests**: Use React Testing Library for component testing with user interactions.
- **Integration Tests**: Test entire features including API calls using Vitest with Cloudflare Workers pool.
- **E2E Tests**: Use Playwright or similar for full user journey testing (optional).
- **Type Safety**: Leverage TypeScript compiler for compile-time architecture validation.
- Always write tests before implementation (TDD) when possible.
- Test file naming: `*.test.{ts,tsx}` co-located with source files.

## 7. Architecture Validation

To enforce architecture rules without ESLint, use TypeScript compiler configuration and code review practices:

### TypeScript Path Mapping for Clear Dependencies

Use TypeScript path mapping to encourage proper imports and make violations more obvious:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/database/*": ["./database/*"],
      "~/*": ["./app/*"],
      "~/workers/*": ["./workers/*"]
    }
  }
}
```

With this configuration, you can use clean imports:

```typescript
// ✅ Good - Clean import paths
import { Transaction } from "~/features/finance/domain/entities/Transaction";
import { Button } from "~/components/ui/button";
import { utils } from "~/lib/utils";
import { transactionSchema } from "~/database/schema/transactions";
import { transactionsApi } from "~/workers/api/transactions";

// ❌ Avoid - Relative paths that are hard to understand
import { Transaction } from "../../../features/finance/domain/entities/Transaction";
import { Button } from "../../components/ui/button";
```

### Code Review Checklist

During code reviews, verify:

1. **Domain Layer Purity**: Domain files should not import React, UI libraries, or infrastructure concerns
2. **Layer Dependencies**: Each layer only imports from allowed layers according to the dependency rules
3. **Feature Isolation**: Features should not directly import from other features
4. **Shared Code Usage**: Common functionality should be in shared directories (`app/lib/`, `app/components/`, `app/hooks/`)

## Additional Guidelines

1. Use React Context and custom hooks to manage dependencies and state across layers.
2. Avoid circular dependencies between features and layers.
3. Write unit tests for **Domain** and **Application** layers (pure TypeScript logic).
4. Use React Testing Library for **Component** testing.
5. Use integration tests for **Route** level testing with API mocking.
6. Follow SOLID principles within each layer.
7. Use React Query or SWR for server state management in the Infrastructure layer.
8. Implement proper error boundaries and error handling at appropriate layers.
9. Use Zod or similar for runtime validation at API boundaries.
10. Leverage TypeScript's type system for compile-time validation of architecture rules.

## React/TypeScript Specific Patterns

- **Custom Hooks**: Encapsulate business logic in custom hooks within the Application layer.
- **Context Providers**: Use for dependency injection and cross-cutting concerns.
- **Higher-Order Components/Render Props**: For cross-cutting UI concerns (rare, prefer hooks).
- **Error Boundaries**: Implement at route or feature level for error handling.
- **Suspense**: Use for loading states and code splitting.
- **Form Management**: Use React Hook Form with Zod validation in the Application layer.

# References
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/TheCleanArchitecture.html)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React + TypeScript Best Practices](https://github.com/typescript-cheatsheets/react)
- [React Patterns](https://reactpatterns.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
