---
applyTo: '**/*.{ts,tsx,test.ts,test.tsx,spec.ts,spec.tsx}'
---
# Rules for Unit and Integration Tests

This rule defines the best practices and tools to use for writing unit and integration tests in the TypeScript React project.

## Libraries and Tools
- **Test Framework**: Always use `Vitest` for unit and integration tests (configured with @cloudflare/vitest-pool-workers).
- **Mocks**: Use `vi.mock()` and `vi.fn()` from Vitest to create mocks in unit tests.
- **React Testing**: Use `@testing-library/react` for component testing with proper TypeScript support.
- **API Testing**: Use `MSW` (Mock Service Worker) to mock API calls and external services.
- **Integration Tests**: Use Vitest with Cloudflare Workers testing environment for full-stack integration tests.

## General Steps
1. **Unit Tests**:
   - Write tests for each valid and invalid scenario.
   - Use `vi.mock()` and `vi.fn()` to mock dependencies.
   - Test domain logic, custom hooks, and utility functions.
   - Verify error handling and expected results.

2. **Component Tests**:
   - Use `@testing-library/react` for component testing.
   - Test user interactions and component behavior.
   - Mock external dependencies and API calls.
   - Focus on testing component contract, not implementation details.

3. **Integration Tests**:
   - Set up test environment with Cloudflare Workers testing tools.
   - Use MSW to mock external API calls.
   - Test the integration between React components, hooks, and API layers.
   - Validate complete user workflows and business flows.

4. **Performance Tests**:
   - Add tests to validate the performance of critical features.
   - Use Vitest benchmarking for performance-critical functions.

## Unit Tests
- Located in `tests/unit/` or co-located with source files as `*.test.ts` or `*.spec.ts`.
- Test **Domain** logic, **Custom Hooks**, and **Utility Functions**.
- Use `vi.mock()` and `vi.fn()` to mock external dependencies.
- Do not test React components directly (use component tests instead).
- Focus on business logic, domain models, and pure functions.
- Example test locations:
  - `app/features/finance/domain/Transaction.test.ts`
  - `app/features/finance/hooks/useTransactions.test.ts`
  - `app/lib/utils.test.ts`

### Unit Test Examples
```typescript
// Domain logic test
import { describe, it, expect, vi } from 'vitest';
import { Transaction } from '../domain/Transaction';

describe('Transaction', () => {
  it('should create valid transaction', () => {
    const transaction = Transaction.create({
      amount: 100,
      currency: 'USD',
      description: 'Test transaction'
    });
    
    expect(transaction.isValid()).toBe(true);
  });

  it('should throw error for negative amount', () => {
    expect(() => {
      Transaction.create({
        amount: -100,
        currency: 'USD',
        description: 'Invalid transaction'
      });
    }).toThrow('Amount cannot be negative');
  });
});

// Custom hook test
import { renderHook, waitFor } from '@testing-library/react';
import { useTransactions } from '../hooks/useTransactions';

vi.mock('../api/transactions', () => ({
  fetchTransactions: vi.fn().mockResolvedValue([])
}));

describe('useTransactions', () => {
  it('should load transactions on mount', async () => {
    const { result } = renderHook(() => useTransactions());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.transactions).toEqual([]);
  });
});
```

## Component Tests
- Located alongside components as `*.test.tsx` or in `tests/components/`.
- Test **React Components** and their behavior.
- Use `@testing-library/react` for rendering and user interactions.
- Mock external dependencies and API calls.
- Focus on component contract and user experience.
- Test accessibility and responsive behavior.

### Component Test Examples
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransactionForm } from '../components/TransactionForm';

// Mock the API
vi.mock('../api/transactions', () => ({
  createTransaction: vi.fn()
}));

describe('TransactionForm', () => {
  it('should submit valid transaction', async () => {
    const onSubmit = vi.fn();
    
    render(<TransactionForm onSubmit={onSubmit} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '100' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test transaction' }
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        amount: 100,
        description: 'Test transaction'
      });
    });
  });

  it('should show validation errors', async () => {
    render(<TransactionForm onSubmit={vi.fn()} />);
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(await screen.findByText(/amount is required/i)).toBeInTheDocument();
  });
});
```

## Integration Tests
- Located in `tests/integration/` or `workers/tests/`.
- Test the **API layers**, **Database interactions**, and **Full-stack workflows**.
- Use Vitest with `@cloudflare/vitest-pool-workers` for Cloudflare Workers testing.
- Use MSW (Mock Service Worker) for external API mocking.
- Test complete user journeys and business workflows.
- Validate data persistence and external service integration.

### Integration Test Examples
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import worker from '../workers/app';

describe('Transaction API Integration', () => {
  beforeEach(async () => {
    // Setup test database - use actual schema
    await env.DB.exec(`
      DELETE FROM transactions;
      DELETE FROM currencies;
    `);
    
    // Insert test currencies
    await env.DB.exec(`
      INSERT INTO currencies (code, name, symbol) VALUES 
      ('USD', 'US Dollar', '$'),
      ('EUR', 'Euro', '€');
    `);
  });

  it('should create and retrieve transaction', async () => {
    const ctx = createExecutionContext();
    
    // Create transaction
    const createResponse = await worker.fetch(
      new Request('http://localhost/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 100,
          currency: 'USD',
          description: 'Test transaction',
          type: 'expense'
        })
      }),
      env,
      ctx
    );

    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();
    expect(created.id).toBeDefined();
    
    // Retrieve transaction
    const getResponse = await worker.fetch(
      new Request(`http://localhost/api/transactions/${created.id}`),
      env,
      ctx
    );

    expect(getResponse.status).toBe(200);
    const retrieved = await getResponse.json();
    expect(retrieved.amount).toBe(100);
    expect(retrieved.currency).toBe('USD');

    await waitOnExecutionContext(ctx);
  });

  it('should validate currency exists', async () => {
    const ctx = createExecutionContext();
    
    const response = await worker.fetch(
      new Request('http://localhost/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 100,
          currency: 'INVALID',
          description: 'Test transaction',
          type: 'expense'
        })
      }),
      env,
      ctx
    );

    expect(response.status).toBe(400);
    const error = await response.json();
    expect(error.message).toContain('Invalid currency');

    await waitOnExecutionContext(ctx);
  });
});

// React + API Integration Test with MSW
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const server = setupServer(
  http.get('/api/currencies', () => {
    return HttpResponse.json([
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' }
    ]);
  }),
  
  http.post('/api/transactions', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ 
      id: '1', 
      ...body,
      createdAt: new Date().toISOString()
    }, { status: 201 });
  }),

  http.get('/api/transactions', () => {
    return HttpResponse.json([]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Transaction Flow Integration', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('should complete full transaction creation flow', async () => {
    renderWithProviders(<TransactionApp />);
    
    // Wait for currencies to load
    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument();
    });
    
    // Navigate to form
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));
    
    // Fill form fields
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '100' }
    });
    
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test transaction' }
    });
    
    // Select currency
    const currencySelect = screen.getByLabelText(/currency/i);
    fireEvent.change(currencySelect, { target: { value: 'USD' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify success feedback
    expect(await screen.findByText(/transaction created successfully/i)).toBeInTheDocument();
    
    // Verify transaction appears in list (if on same page)
    await waitFor(() => {
      expect(screen.getByText('$100.00')).toBeInTheDocument();
    });
  });
  
  it('should handle form validation errors', async () => {
    renderWithProviders(<TransactionForm onSubmit={vi.fn()} />);
    
    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Check validation messages
    expect(await screen.findByText(/amount is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/description is required/i)).toBeInTheDocument();
  });
});
```

## Best Practices
- Always write tests before implementation (TDD).
- Document test cases in the corresponding files.
- Use explicit test names to describe their purpose.
- Follow the Testing Trophy pattern: More integration tests, fewer E2E tests.
- Use TypeScript for type safety in tests.
- Mock external dependencies but test real business logic.
- Test behavior, not implementation details.
- Use data-testid sparingly, prefer semantic queries.
- Test error states and edge cases.
- Keep tests independent and deterministic.

## Test Organization
```
app/features/finance/
  domain/
    Transaction.ts
    Transaction.test.ts           # Unit tests for domain logic
    Money.ts
    Money.test.ts
  hooks/
    useTransactions.ts
    useTransactions.test.ts       # Unit tests for hooks
    useCurrencies.ts
    useCurrencies.test.ts
  components/
    TransactionList.tsx
    TransactionList.test.tsx      # Component tests
    TransactionForm.tsx
    TransactionForm.test.tsx
  lib/
    validation.ts
    validation.test.ts           # Utility tests
    utils.ts
    utils.test.ts
  examples/
    TransactionExample.test.tsx  # Example component tests

tests/
  integration/
    transaction-flow.test.ts     # End-to-end user flows
    currency-api.test.ts         # API integration tests
  setup.ts                       # Test setup and configuration
  mocks/                         # Shared mocks and fixtures
    handlers.ts                  # MSW handlers
    data.ts                      # Test data fixtures
    db.ts                        # Database test utilities

workers/tests/
  common.test.ts                 # Worker utility tests
  api/
    transactions.test.ts         # Transaction API tests
    currencies.test.ts           # Currency API tests
    setup.test.ts               # Database setup tests

database/
  schema/
    transactions.test.ts         # Schema validation tests
    currencies.test.ts           # Schema validation tests
```

## Additional Rule: Continuous Test Execution

- After every significant change or addition, run `bun test` or `bun run typecheck` to verify the current state of the project.
- This ensures that all tests pass and helps identify issues early in the development process.
- Use `bun test --watch` for continuous testing during development.
- Document the results of the test runs in the corresponding task or user story.
- Run tests in CI/CD pipeline before deployment.

## Test Commands
```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test TransactionForm.test.tsx

# Run tests with coverage
bun test --coverage

# Type checking
bun run typecheck

# Run integration tests only
bun test tests/integration

# Run component tests only
bun test --reporter=verbose *.test.tsx

# Run worker tests only
bun test workers/tests

# Run tests for specific feature
bun test app/features/finance

# Run tests with UI (for debugging)
bun test --ui

# Run tests and generate HTML coverage report
bun test --coverage --reporter=html
```

## Test Setup & Configuration

### Vitest Configuration Example
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'build/',
        'tests/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
      '~/database': path.resolve(__dirname, './database'),
      '~/workers': path.resolve(__dirname, './workers'),
    },
  },
});
```

### Test Setup File
```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('~/env', () => ({
  env: {
    NODE_ENV: 'test',
    DATABASE_URL: ':memory:',
  },
}));

// Mock Cloudflare Workers APIs
global.fetch = vi.fn();

// Setup MSW
import { server } from './mocks/server';
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### MSW Handlers Example
```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { transactionFixtures, currencyFixtures } from './fixtures';

export const handlers = [
  // Currency endpoints
  http.get('/api/currencies', () => {
    return HttpResponse.json(currencyFixtures);
  }),

  // Transaction endpoints
  http.get('/api/transactions', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '10';
    return HttpResponse.json(transactionFixtures.slice(0, parseInt(limit)));
  }),

  http.post('/api/transactions', async ({ request }) => {
    const body = await request.json();
    const newTransaction = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json(newTransaction, { status: 201 });
  }),

  http.get('/api/transactions/:id', ({ params }) => {
    const transaction = transactionFixtures.find(t => t.id === params.id);
    if (!transaction) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(transaction);
  }),
];
```

## Updates
This rule must be updated if new tools or practices are adopted in the TypeScript React project.

## Configuration References
- **Vitest Config**: `vitest.config.ts` - Main test configuration
- **TypeScript Config**: `tsconfig.json` - Type checking for tests  
- **React Testing Library**: For component testing utilities
- **MSW**: For API mocking in tests
- **Cloudflare Workers**: `@cloudflare/vitest-pool-workers` for worker testing