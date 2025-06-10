---
applyTo: '**/*.{ts,tsx}'
---

# TypeScript & React Coding Style Guidelines

## General Guidelines
- Follow the official TypeScript and React best practices
- Prefer clarity and readability over brevity
- Use consistent formatting and naming throughout the codebase
- Leverage TypeScript's type system for better code safety
- Follow React functional component patterns with hooks
- Use strict TypeScript configuration for better type safety

## Naming Conventions
- Use `PascalCase` for React components and type/interface names
- Use `camelCase` for variables, functions, and methods
- Use `SCREAMING_SNAKE_CASE` for constants
- Use descriptive names; avoid abbreviations unless widely understood
- Prefix interfaces with `I` when needed for clarity (e.g., `IUserRepository`)
- Use descriptive file names that match component names

### Examples
```typescript
// Components
const UserProfile = () => { /* ... */ };
const TransactionList = () => { /* ... */ };

// Types and Interfaces
interface User {
  id: string;
  name: string;
}

type TransactionType = 'income' | 'expense';

// Variables and functions
const userName = 'John Doe';
const calculateTotal = (items: Item[]) => { /* ... */ };

// Constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
```

## Formatting
- Use 2 spaces for indentation (standard for TypeScript/React)
- Add blank lines between function definitions and logical sections
- Use trailing commas in multiline objects and arrays
- Place opening braces on the same line (JavaScript/TypeScript convention)
- Use semicolons consistently

### Example
```typescript
const userConfig = {
  name: 'John',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    notifications: true,
  },
};

const processUser = (user: User): ProcessedUser => {
  // Function logic here
  return processedUser;
};
```

## TypeScript Best Practices
- Use strict TypeScript configuration
- Prefer type inference when the type is obvious
- Use explicit types for function parameters and return types
- Avoid `any` type; use `unknown` when necessary
- Use union types and type guards for better type safety
- Leverage utility types (`Partial`, `Pick`, `Omit`, etc.)

### Examples
```typescript
// Type inference (good)
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
];

// Explicit types for functions (required)
const getUserById = (id: number): User | undefined => {
  return users.find(user => user.id === id);
};

// Union types and type guards
type Status = 'loading' | 'success' | 'error';

const isError = (status: Status): status is 'error' => {
  return status === 'error';
};

// Utility types
type CreateUserRequest = Omit<User, 'id'>;
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;
```

## React Component Patterns
- Use functional components with hooks
- Prefer named exports over default exports for better refactoring
- Use custom hooks for reusable logic
- Keep components small and focused on single responsibility
- Use proper TypeScript typing for props and state

### Component Structure
```typescript
// Props interface
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  className?: string;
}

// Component with proper typing
export const UserProfile = ({ user, onUpdate, className }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = useCallback((updatedUser: User) => {
    onUpdate(updatedUser);
    setIsEditing(false);
  }, [onUpdate]);

  return (
    <div className={cn('user-profile', className)}>
      {/* Component content */}
    </div>
  );
};
```

## Hooks Guidelines
- Use built-in hooks appropriately (`useState`, `useEffect`, `useCallback`, `useMemo`)
- Create custom hooks for complex or reusable logic
- Follow hooks rules (only call at top level, only call from React functions)
- Use proper dependency arrays for `useEffect`, `useCallback`, and `useMemo`

### Custom Hook Example
```typescript
const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
```

## File Organization
- One component per file (except for closely related small components)
- Use index files for clean imports
- Organize files by feature/domain
- Keep related files close together
- Use barrel exports for clean imports
- Follow the established project structure

### Project-Specific File Structure
```
app/features/finance/
├── components/
│   ├── TransactionList.tsx
│   ├── TransactionItem.tsx
│   ├── TransactionForm.tsx
│   └── index.ts                    # Barrel exports
├── hooks/
│   ├── useTransactions.ts
│   ├── useTransactionForm.ts
│   └── index.ts
├── types/
│   ├── transaction.ts
│   ├── account.ts
│   └── index.ts
├── lib/
│   ├── validation.ts              # Zod schemas
│   ├── utils.ts
│   └── index.ts
└── examples/                      # Example components/demos

workers/
├── app.ts                         # Main worker entry
├── api/
│   ├── common.ts                  # Shared utilities
│   ├── transactions.ts            # Transaction API handlers
│   ├── currencies.ts              # Currency API handlers
│   └── setup.ts                   # Database setup
└── tests/
    ├── common.test.ts
    └── api/
        └── transactions.test.ts

database/
├── schema.ts                      # Main schema exports
└── schema/
    ├── transactions.ts
    ├── currencies.ts
    └── accounts.ts                # Individual schema files
```

## Error Handling
- Use proper error boundaries for React components
- Handle async errors appropriately
- Use type-safe error handling with union types
- Provide meaningful error messages

### Example
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

const fetchUserData = async (id: string): Promise<Result<User>> => {
  try {
    const user = await api.getUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
};
```

## Comments & Documentation
- Use TSDoc comments for public APIs and complex functions
- Write comments to explain why, not what
- Remove commented-out code before committing
- Document complex business logic and edge cases

### Example
```typescript
/**
 * Calculates the total amount for a list of transactions
 * @param transactions - Array of transaction objects
 * @param includePending - Whether to include pending transactions in the calculation
 * @returns The total amount as a number
 */
const calculateTransactionTotal = (
  transactions: Transaction[], 
  includePending = false
): number => {
  return transactions
    .filter(t => includePending || t.status === 'completed')
    .reduce((total, transaction) => total + transaction.amount, 0);
};
```

## Modern TypeScript/React Features
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Leverage template literals for string building
- Use destructuring for cleaner code
- Prefer async/await over promises chains
- Use modern array methods (`map`, `filter`, `reduce`, etc.)

### Examples
```typescript
// Optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Anonymous';

// Template literals
const welcomeMessage = `Welcome back, ${user.name}!`;

// Destructuring
const { name, email, ...otherProps } = user;

// Modern array methods
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => ({ ...user, lastSeen: new Date() }));
```

## Path Aliases
- Use configured path aliases for clean imports
- Follow the project's TypeScript path configuration
- Avoid relative imports for files outside the current feature

### Project-Specific Path Aliases
```typescript
// Use configured path aliases (good)
import { Button } from '~/components/ui/button';
import { getUserById } from '~/database/users';
import { transactionSchema } from '~/database/schema/transactions';

// Worker imports
import type { Env } from '~/workers/types';
import { handleTransactions } from '~/workers/api/transactions';

// Feature imports
import { useTransactions } from '~/features/finance/hooks/useTransactions';
import type { Transaction } from '~/features/finance/types/transaction';

// Avoid deep relative imports (bad)
import { Button } from '../../../components/ui/button';
import { transactionSchema } from '../../database/schema/transactions';
```

## Cloudflare Workers Guidelines
- Use proper TypeScript types for Cloudflare Workers environment
- Handle Request/Response objects with proper typing
- Use environment variables with type safety

### Worker Example
```typescript
// Worker with proper typing
import type { ExecutionContext } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  // Other environment variables
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Worker logic here
    return new Response('Hello World');
  },
};

// API handler example
export const handleTransactionAPI = async (
  request: Request,
  env: Env
): Promise<Response> => {
  try {
    const body = await request.json();
    // Process with proper validation
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
};
```

## Database & Drizzle ORM Guidelines
- Use Drizzle schema definitions consistently
- Implement proper type safety for database operations
- Use transactions for data integrity

### Database Schema Example
```typescript
// Schema definition
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  description: text('description').notNull(),
  createdAt: integer('created_at').notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

// Repository pattern with Drizzle
class TransactionRepository {
  constructor(private db: D1Database) {}

  async findById(id: string): Promise<Transaction | null> {
    const result = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);
    
    return result[0] ?? null;
  }

  async create(transaction: NewTransaction): Promise<Transaction> {
    const [created] = await this.db
      .insert(transactions)
      .values(transaction)
      .returning();
    
    return created;
  }
}
```

## React Router v7 Guidelines
- Use proper route typing and data loading patterns
- Implement type-safe route parameters and loaders
- Follow React Router v7 conventions

### Route Example
```typescript
// Route component with loader
import type { Route } from 'react-router';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { transactionId } = params;
  
  if (!transactionId) {
    throw new Response('Transaction ID required', { status: 400 });
  }

  const transaction = await getTransactionById(transactionId);
  
  if (!transaction) {
    throw new Response('Transaction not found', { status: 404 });
  }

  return { transaction };
};

export default function TransactionDetail() {
  const { transaction } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>Transaction: {transaction.description}</h1>
      <p>Amount: {transaction.amount}</p>
    </div>
  );
}
```

## Package Management & Development
- Use Bun as the primary package manager
- Follow Bun-specific patterns and commands
- Use proper scripts in package.json

### Bun Commands
```bash
# Install dependencies
bun install

# Development server
bun run dev

# Build for production
bun run build

# Run tests
bun test

# Type checking
bun run typecheck

# Database operations
bun run db:generate
bun run db:migrate
bun run db:studio

# Worker development
bun run dev:worker
```

### Package.json Scripts Example
```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "start": "bun run workers/app.ts",
    "test": "vitest",
    "typecheck": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Form Handling & Validation
- Use React Hook Form with Zod for form validation
- Implement type-safe form schemas
- Use shadcn/ui form components

### Form Example
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema
const transactionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  currency: z.enum(['USD', 'EUR', 'GBP']),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

// Form component
const TransactionForm = ({ onSubmit }: { onSubmit: (data: TransactionFormData) => void }) => {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      description: '',
      currency: 'USD',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Other fields */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
```

# References
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Official Documentation](https://react.dev/)
- [React Router v7 Documentation](https://reactrouter.com/)
- [Vite Configuration Guide](https://vitejs.dev/config/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)