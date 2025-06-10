---
applyTo: '**/*.{ts,tsx}'
---

# Domain-Driven Design (DDD) for TypeScript & React

## Purpose
These rules help you apply Domain-Driven Design principles in TypeScript and React applications to ensure your codebase is expressive, maintainable, and aligned with business needs.

## Objective
Ensure a clear separation of concerns, encapsulate business logic within domain models, and promote a shared understanding of the domain while leveraging TypeScript's type system for better domain modeling.

## Structure 

All domain logic should be encapsulated within the domain layer, which is separate from the application (components/hooks) and infrastructure (API calls) layers.

The domain layer should contain the following components:
- **Entities**: Objects with a distinct identity that persists over time
- **Value Objects**: Immutable objects that are defined only by their attributes
- **Aggregates**: A cluster of domain objects treated as a single unit
- **Repositories**: Interfaces for accessing aggregates
- **Strongly Typed IDs**: Use branded types for entities and aggregates to avoid confusion
- **Domain Events**: Events that signify a change in the state of the domain
- **Domain Services**: Business logic that doesn't naturally fit within entities or value objects

All elements should be organized in the `app/features/[feature]/domain/` directory structure to align with your React application architecture.

## Modeling Guidelines

#### Aggregates
- Aggregates are the root of the DDD model and represent a consistency boundary
- Aggregates must always be created via a static factory method (e.g. `Transaction.create(...)`)
- Use private constructors to enforce factory method usage
- Aggregates can contain entities or value objects, but never other aggregates
- Use readonly properties for encapsulation; expose only business methods to change state
- Aggregates are responsible for enforcing all business rules and invariants within their boundary
- Return Result types or throw domain-specific errors for business rule violations

#### Entities
- Entities are owned by aggregates and should not be used outside of them
- Entities must be created via a factory method of the aggregate root
- Entities must have a unique identifier (id) and encapsulate their state
- Use readonly properties and expose only business methods for state changes
- Entities' lifecycle is managed by the aggregate root

#### Value Objects
- Value objects are immutable and defined only by their attributes; they have no identity
- Use value objects to encapsulate concepts that do not require identity (e.g. Money, DateRange)
- Value objects must be created via constructors or static factory methods
- Implement structural equality using TypeScript's object comparison or custom equality methods
- Value objects should be used to express business concepts and enforce invariants at construction

#### Strongly Typed IDs
- Use branded types for entity and aggregate identifiers instead of primitive types
- This approach prevents confusion and increases type safety across the domain
- Example: `type TransactionId = string & { readonly brand: unique symbol }`

#### Repositories
- Repositories are interfaces defined in the domain layer for accessing aggregates
- Implement repositories only for aggregate roots, not for entities or value objects
- Repositories should expose only business-relevant methods and avoid CRUD-style methods
- The repository interface should use domain language and reflect business intent
- Implementations belong in the infrastructure layer (API clients, local storage adapters)

#### Domain Events
- Use domain events to communicate changes between aggregates
- Events should be immutable and contain all necessary data
- Consider using React's event system or custom event emitters for domain events
- Events can trigger side effects in React components or other domain aggregates

## TypeScript-Specific Guidelines

#### Use Branded Types for Type Safety
```typescript
// Strongly typed IDs
type TransactionId = string & { readonly brand: unique symbol };
type AccountId = string & { readonly brand: unique symbol };

const createTransactionId = (value: string): TransactionId => value as TransactionId;
```

#### Leverage Union Types for Domain Modeling
```typescript
type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
type TransactionType = 'income' | 'expense' | 'transfer';
```

#### Use Result Types for Error Handling
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

## React Integration Guidelines

#### Keep Domain Logic Pure
- Domain objects should not depend on React or any UI framework
- Use pure TypeScript classes/objects for domain models
- Separate domain logic from React components and hooks

#### Use Custom Hooks for Domain Integration
- Create custom hooks to bridge domain logic with React components
- Handle domain events and state changes in hooks
- Keep business logic in domain objects, use hooks for React integration

#### Component-Domain Separation
```typescript
// Domain layer - pure TypeScript
class Transaction { /* domain logic */ }

// Application layer - React integration
const useTransactions = () => {
  // React state management
  // Domain object integration
  // API calls through repositories
}

// Presentation layer - React components
const TransactionList = () => {
  const { transactions } = useTransactions();
  // UI rendering only
}
```

## Best Practices
- Model your aggregates and entities to reflect real business concepts
- Keep aggregates small and focused
- Use value objects to encapsulate concepts with no identity
- Raise domain events for significant business actions
- Avoid using CRUD verbs in domain method names—prefer business-intent names
- Encapsulate invariants and business rules within aggregates
- Use repositories only for aggregate roots
- Keep domain logic out of React components and infrastructure concerns
- Leverage TypeScript's type system for domain modeling
- Use immutable patterns where possible

## Method Naming
- Do not use generic CRUD method names like set, create, update, delete, or get in domain methods
- Always use method names that reflect business intent and ubiquitous language
- Examples: `recordTransaction`, `categorizeExpense`, `reconcileAccount`, `calculateBalance`

## Example Structure
```
app/features/finance/
  domain/
    transaction/
      Transaction.ts
      TransactionId.ts
      TransactionRepository.ts
      TransactionCreatedEvent.ts
    account/
      Account.ts
      AccountId.ts
      AccountRepository.ts
      Money.ts
    category/
      Category.ts
      CategoryId.ts
  application/
    hooks/
      useTransactions.ts
      useAccounts.ts
  components/
    TransactionList.tsx
    AccountSummary.tsx
  infrastructure/
    repositories/
      ApiTransactionRepository.ts
      LocalAccountRepository.ts
```

## Modeling Guidelines

#### Aggregates
- Aggregates are the root of the DDD model and represent a consistency boundary; they map 1:1 to business concepts and typically to database tables.
- Aggregates must always be created via a static factory method (e.g. `Order.Create(...)`), never via a public constructor.
- Aggregates do not inherit from a base AggregateRoot or Entity class; inheritance is not required in DDD and should be avoided unless justified by a real business need.
- Aggregates can contain entities or value objects, but never other aggregates.
- Use private or protected constructors for aggregates to enforce factory method usage.
- Do not use navigation properties to other aggregates (e.g. do not use `Order.Customer`).
- Use private fields and properties for encapsulation; expose only business methods to change state and enforce invariants.
- Aggregates are responsible for enforcing all business rules and invariants within their boundary.

#### Entities
- Entities are owned by aggregates and should not be used outside of them.
- Entities must be created via a factory method of the aggregate root (not directly via public constructor).
- Entities must have a unique identifier (Id) and encapsulate their state (no public setters).
- Entities should have private or protected constructors and expose only business methods for state changes.
- Entities' lifecycle is managed by the aggregate root.
- Entities should not inherit from a base Entity or AggregateRoot class; inheritance is not required in DDD and should be avoided unless justified by a real business need.

#### Value Objects
- Value objects are immutable and defined only by their attributes; they have no identity.
- Use value objects to encapsulate concepts that do not require identity (e.g. Money, Address).
- Value objects must be created via constructors or static factory methods and must not expose setters.
- Always implement value equality (override Equals and GetHashCode).
- Value objects should be used to express business concepts and enforce invariants at construction.

#### Strongly Typed IDs
- Use strongly typed IDs (e.g. OrderId, CustomerId) instead of primitive types for entity and aggregate identifiers.
- Strongly typed IDs should be implemented as value objects.
- This approach prevents confusion and increases type safety across the domain.

#### Repositories
- Repositories are interfaces defined in the domain or application layer for accessing aggregates.
- Implement repositories only for aggregate roots, not for entities or value objects.
- Repositories should expose only business-relevant methods (e.g. `FindOrderByNumber`, `PlaceOrder`) and avoid CRUD-style methods (no Set, Create, Update, Delete, Get).
- The repository interface should use domain language and reflect business intent.
- Implementations of repositories belong in the infrastructure layer.

#### Business-Oriented Method Names
- Prefer business-oriented or intention-revealing names for methods in domain objects (e.g. `PlaceOrder`, `ActivateAccount`, `MarkAsShipped`).
- Avoid using generic CRUD method names (e.g. `Set`, `Create`, `Update`, `Delete`, `Get`) in domain or repository methods.
- The method name should reflect the business action or intent, not the technical operation.

## Best Practices
- Model your aggregates and entities to reflect real business concepts.
- Keep aggregates small and focused.
- Use value objects to encapsulate concepts with no identity.
- Raise domain events for significant business actions.
- Avoid using CRUD verbs (Create, Update, Delete, Get) in domain method names—prefer business-intent names (e.g., PlaceOrder, ActivateAccount).
- Encapsulate invariants and business rules within aggregates.
- Use repositories only for aggregate roots.
- Keep domain logic out of application and infrastructure layers.

## Method Naming
- Do not use generic CRUD method names like Set, Create, Update, Delete, or Get in domain or repository methods.
- Always use method names that reflect business intent and ubiquitous language (e.g. PlaceOrder, ActivateAccount, MarkAsShipped).

## Example Structure
```
src/
  [project].Domain/
    Order/
      Order.cs
      OrderLine.cs
      OrderPlacedEvent.cs
    Customer/
      Customer.cs
      Address.cs
```

## TypeScript Examples

### Transaction Aggregate (Finance Domain)
```typescript
// Branded types for type safety
type TransactionId = string & { readonly brand: unique symbol };
type AccountId = string & { readonly brand: unique symbol };
type CategoryId = string & { readonly brand: unique symbol };

// Value Objects
class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {
    if (amount < 0) throw new Error('Amount cannot be negative');
    if (!currency) throw new Error('Currency is required');
  }

  static create(amount: number, currency: string): Money {
    return new Money(amount, currency);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return Money.create(this.amount + other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}

// Domain Events
interface TransactionRecordedEvent {
  readonly type: 'TransactionRecorded';
  readonly transactionId: TransactionId;
  readonly accountId: AccountId;
  readonly amount: Money;
  readonly occurredAt: Date;
}

// Transaction Aggregate Root
class Transaction {
  private constructor(
    public readonly id: TransactionId,
    public readonly accountId: AccountId,
    public readonly amount: Money,
    public readonly description: string,
    public readonly categoryId: CategoryId,
    public readonly occurredAt: Date,
    private _status: TransactionStatus = 'pending'
  ) {}

  static recordTransaction(
    id: TransactionId,
    accountId: AccountId,
    amount: Money,
    description: string,
    categoryId: CategoryId,
    occurredAt: Date = new Date()
  ): Result<Transaction, string> {
    // Business rules validation
    if (!description.trim()) {
      return { success: false, error: 'Description cannot be empty' };
    }

    if (amount.amount === 0) {
      return { success: false, error: 'Transaction amount cannot be zero' };
    }

    const transaction = new Transaction(
      id, accountId, amount, description, categoryId, occurredAt
    );

    // Raise domain event
    // Events would be handled by infrastructure layer
    
    return { success: true, data: transaction };
  }

  get status(): TransactionStatus {
    return this._status;
  }

  confirmTransaction(): Result<void, string> {
    if (this._status !== 'pending') {
      return { success: false, error: 'Only pending transactions can be confirmed' };
    }

    this._status = 'completed';
    
    // Raise TransactionConfirmedEvent
    return { success: true, data: undefined };
  }

  cancelTransaction(reason: string): Result<void, string> {
    if (this._status === 'completed') {
      return { success: false, error: 'Cannot cancel completed transaction' };
    }

    this._status = 'cancelled';
    
    // Raise TransactionCancelledEvent with reason
    return { success: true, data: undefined };
  }
}

// Repository Interface (in domain layer)
interface TransactionRepository {
  findById(id: TransactionId): Promise<Transaction | null>;
  findByAccount(accountId: AccountId): Promise<readonly Transaction[]>;
  findByDateRange(accountId: AccountId, startDate: Date, endDate: Date): Promise<readonly Transaction[]>;
  recordTransaction(transaction: Transaction): Promise<Result<void, string>>;
}

// Domain Service Example
class TransactionCategorizationService {
  categorizeByDescription(description: string): CategoryId {
    // Business logic for automatic categorization
    const normalizedDesc = description.toLowerCase().trim();
    
    if (normalizedDesc.includes('grocery') || normalizedDesc.includes('supermarket')) {
      return 'food' as CategoryId;
    }
    
    if (normalizedDesc.includes('gas') || normalizedDesc.includes('fuel')) {
      return 'transportation' as CategoryId;
    }
    
    return 'other' as CategoryId;
  }
}
```

### Account Aggregate Example
```typescript
type AccountType = 'checking' | 'savings' | 'credit' | 'investment';

class Account {
  private _balance: Money;
  private _transactions: readonly TransactionId[] = [];

  private constructor(
    public readonly id: AccountId,
    public readonly name: string,
    public readonly type: AccountType,
    initialBalance: Money
  ) {
    this._balance = initialBalance;
  }

  static openAccount(
    id: AccountId,
    name: string,
    type: AccountType,
    initialBalance: Money
  ): Result<Account, string> {
    if (!name.trim()) {
      return { success: false, error: 'Account name cannot be empty' };
    }

    if (type === 'savings' && initialBalance.amount < 0) {
      return { success: false, error: 'Savings account cannot have negative balance' };
    }

    return { success: true, data: new Account(id, name, type, initialBalance) };
  }

  get balance(): Money {
    return this._balance;
  }

  get transactions(): readonly TransactionId[] {
    return this._transactions;
  }

  recordTransaction(transactionId: TransactionId, amount: Money): Result<void, string> {
    // Business rules for account-specific transaction recording
    if (this.type === 'savings' && amount.amount < 0) {
      const newBalance = this._balance.add(Money.create(amount.amount, amount.currency));
      if (newBalance.amount < 0) {
        return { success: false, error: 'Insufficient funds in savings account' };
      }
    }

    this._balance = this._balance.add(amount);
    this._transactions = [...this._transactions, transactionId];

    return { success: true, data: undefined };
  }

  calculateMonthlyExpenses(month: number, year: number): Money {
    // Business logic for calculating monthly expenses
    // This would work with transaction data
    return Money.create(0, this._balance.currency);
  }
}
```

### React Integration Example
```typescript
// Custom Hook for Transaction Management
const useTransactions = (accountId: AccountId) => {
  const [transactions, setTransactions] = useState<readonly Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const transactionRepo = useTransactionRepository(); // Injected repository

  const recordTransaction = useCallback(async (
    amount: Money,
    description: string,
    categoryId: CategoryId
  ): Promise<Result<Transaction, string>> => {
    const transactionId = generateTransactionId();
    
    // Use domain aggregate
    const result = Transaction.recordTransaction(
      transactionId, accountId, amount, description, categoryId
    );

    if (!result.success) {
      return result;
    }

    // Persist through repository
    const saveResult = await transactionRepo.recordTransaction(result.data);
    
    if (saveResult.success) {
      // Update local state
      setTransactions(prev => [...prev, result.data]);
    }

    return saveResult.success ? result : saveResult;
  }, [accountId, transactionRepo]);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      const accountTransactions = await transactionRepo.findByAccount(accountId);
      setTransactions(accountTransactions);
      setLoading(false);
    };

    loadTransactions();
  }, [accountId, transactionRepo]);

  return {
    transactions,
    loading,
    recordTransaction,
  };
};

// React Component (Presentation Layer)
const TransactionForm = ({ accountId }: { accountId: AccountId }) => {
  const { recordTransaction } = useTransactions(accountId);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const money = Money.create(parseFloat(amount), 'USD');
    const result = await recordTransaction(
      money, 
      description, 
      'other' as CategoryId
    );
    
    if (!result.success) {
      // Handle error in UI
      console.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

# References
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Patterns](https://react-typescript-cheatsheet.netlify.app/)
- Vernon, Vaughn. "Implementing Domain-Driven Design". Addison-Wesley, 2013.
- Evans, Eric. "Domain-Driven Design: Tackling Complexity in the Heart of Software". Addison-Wesley, 2003.
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)