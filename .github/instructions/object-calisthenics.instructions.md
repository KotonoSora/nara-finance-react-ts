---
applyTo: '**/*.{ts,tsx}'
---
# Object Calisthenics Rules for TypeScript & React

> ⚠️ **Warning:** This file contains the 9 original Object Calisthenics rules. No additional rules must be added, and none of these rules should be replaced or removed.
> Examples adapted for TypeScript and React functional programming paradigms.

## Objective
This rule enforces the principles of Object Calisthenics to ensure clean, maintainable, and robust TypeScript and React code, adapted for functional programming patterns and modern frontend development.

## Key Principles


1. **One Level of Indentation per Function/Method**:
   - Ensure functions are simple and do not exceed one level of indentation.
   - Extract complex logic into separate functions or custom hooks.

   ```typescript
   // Bad Example - multiple levels of indentation
   const sendNewsletterToUsers = (users: User[]) => {
     users.forEach(user => {
       if (user.isActive) {
         if (user.hasValidEmail) {
           // Send email logic
           emailService.send(user.email, newsletterContent);
         }
       }
     });
   };

   // Good Example - Extracted function to reduce indentation
   const sendNewsletterToUsers = (users: User[]) => {
     users.forEach(user => {
       sendEmailToUser(user);
     });
   };

   const sendEmailToUser = (user: User) => {
     if (user.isActive && user.hasValidEmail) {
       emailService.send(user.email, newsletterContent);
     }
   };

   // Good Example - Using functional approach
   const sendNewsletterToUsers = (users: User[]) => {
     const activeUsersWithEmail = users.filter(user => 
       user.isActive && user.hasValidEmail
     );
     
     activeUsersWithEmail.forEach(user => {
       emailService.send(user.email, newsletterContent);
     });
   };

   // React Hook Example
   const useNewsletterSender = () => {
     const sendToUsers = useCallback((users: User[]) => {
       const eligibleUsers = filterEligibleUsers(users);
       eligibleUsers.forEach(sendEmailToUser);
     }, []);

     return { sendToUsers };
   };
   ```
2. **Don't Use the ELSE Keyword**:
   - Avoid using the `else` keyword to reduce complexity and improve readability.
   - Use early returns, guard clauses, and functional patterns instead.
   - Apply Fail Fast principle with proper error handling.

   ```typescript
   // Bad Example - Using else
   const processTransaction = (transaction: Transaction) => {
     if (transaction.isValid) {
       // Process transaction
       return processValidTransaction(transaction);
     } else {
       // Handle invalid transaction
       return handleInvalidTransaction(transaction);
     }
   };

   // Good Example - Avoiding else with early return
   const processTransaction = (transaction: Transaction) => {
     if (!transaction.isValid) {
       return handleInvalidTransaction(transaction);
     }
     
     return processValidTransaction(transaction);
   };

   // Good Example - Using Result type pattern
   const processTransaction = (transaction: Transaction): Result<ProcessedTransaction, Error> => {
     if (!transaction.isValid) {
       return { success: false, error: new Error('Invalid transaction') };
     }
     
     const processed = processValidTransaction(transaction);
     return { success: true, data: processed };
   };

   // React Component Example - Avoiding else in JSX
   const TransactionStatus = ({ transaction }: { transaction: Transaction }) => {
     if (!transaction.isValid) {
       return <ErrorMessage message="Invalid transaction" />;
     }

     if (transaction.isPending) {
       return <PendingIndicator />;
     }

     return <SuccessIndicator />;
   };

   // Fail Fast principle with custom hooks
   const useTransactionProcessor = () => {
     const processTransaction = useCallback((transaction: Transaction) => {
       if (!transaction) throw new Error('Transaction is required');
       if (!transaction.isValid) throw new Error('Invalid transaction');
       if (!transaction.amount) throw new Error('Amount is required');
       
       // Process transaction
       return performTransactionProcessing(transaction);
     }, []);

     return { processTransaction };
   };
   ```

3. **Wrapping All Primitives and Strings**:
   - Avoid using primitive types directly in domain logic.
   - Use branded types, value objects, or wrapper classes to provide meaningful context and behavior.
   - Leverage TypeScript's type system for domain modeling.

   ```typescript
   // Bad Example - Using primitive types directly
   interface User {
     name: string;
     age: number;
     email: string;
   }

   const createUser = (name: string, age: number, email: string) => {
     // No validation or domain logic
     return { name, age, email };
   };

   // Good Example - Wrapping primitives with branded types
   type UserId = string & { readonly brand: unique symbol };
   type EmailAddress = string & { readonly brand: unique symbol };

   class Age {
     private constructor(private readonly value: number) {
       if (value < 0) throw new Error('Age cannot be negative');
       if (value > 150) throw new Error('Age cannot exceed 150');
     }

     static create(value: number): Age {
       return new Age(value);
     }

     get getValue(): number {
       return this.value;
     }

     isAdult(): boolean {
       return this.value >= 18;
     }
   }

   class EmailAddress {
     private constructor(private readonly value: string) {
       if (!this.isValidEmail(value)) {
         throw new Error('Invalid email format');
       }
     }

     static create(value: string): EmailAddress {
       return new EmailAddress(value);
     }

     private isValidEmail(email: string): boolean {
       return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
     }

     get getValue(): string {
       return this.value;
     }

     getDomain(): string {
       return this.value.split('@')[1];
     }
   }

   // Domain model with wrapped primitives
   class User {
     private constructor(
       public readonly id: UserId,
       public readonly name: string,
       public readonly age: Age,
       public readonly email: EmailAddress
     ) {}

     static create(id: UserId, name: string, age: number, email: string): User {
       return new User(
         id,
         name,
         Age.create(age),
         EmailAddress.create(email)
       );
     }

     canVote(): boolean {
       return this.age.isAdult();
     }
   }

   // React Component using wrapped types
   const UserProfile = ({ user }: { user: User }) => {
     return (
       <div>
         <h2>{user.name}</h2>
         <p>Age: {user.age.getValue()}</p>
         <p>Email: {user.email.getValue()}</p>
         {user.canVote() && <p>Eligible to vote</p>}
       </div>
     );
   };
   ```

4. **First Class Collections**:
   - Encapsulate collections in dedicated classes/objects that contain only the collection and its related behavior.
   - A class containing a collection should contain no other attributes.

   ```typescript
   // Bad Example - Collection mixed with other attributes
   class TransactionGroup {
     public readonly id: string;
     public readonly name: string;
     public readonly transactions: Transaction[];

     constructor(id: string, name: string, transactions: Transaction[]) {
       this.id = id;
       this.name = name;
       this.transactions = transactions;
     }

     getCompletedTransactionsCount(): number {
       return this.transactions
         .filter(transaction => transaction.status === 'completed')
         .length;
     }
   }

   // Good Example - Separate collection class
   class TransactionGroup {
     public readonly id: string;
     public readonly name: string;
     public readonly transactionCollection: TransactionCollection;

     constructor(id: string, name: string, transactionCollection: TransactionCollection) {
       this.id = id;
       this.name = name;
       this.transactionCollection = transactionCollection;
     }

     getCompletedTransactionsCount(): number {
       return this.transactionCollection.getCompletedCount();
     }
   }

   class TransactionCollection {
     private readonly transactions: readonly Transaction[];

     constructor(transactions: Transaction[]) {
       this.transactions = [...transactions];
     }

     getCompletedCount(): number {
       return this.transactions
         .filter(transaction => transaction.status === 'completed')
         .length;
     }

     getByStatus(status: TransactionStatus): TransactionCollection {
       const filtered = this.transactions.filter(t => t.status === status);
       return new TransactionCollection(filtered);
     }

     getTotalAmount(): Money {
       return this.transactions.reduce(
         (total, transaction) => total.add(transaction.amount),
         Money.zero()
       );
     }

     add(transaction: Transaction): TransactionCollection {
       return new TransactionCollection([...this.transactions, transaction]);
     }

     isEmpty(): boolean {
       return this.transactions.length === 0;
     }

     toArray(): readonly Transaction[] {
       return this.transactions;
     }
   }

   // React Hook using First Class Collection
   const useTransactionCollection = (initialTransactions: Transaction[]) => {
     const [collection, setCollection] = useState(
       () => new TransactionCollection(initialTransactions)
     );

     const addTransaction = useCallback((transaction: Transaction) => {
       setCollection(prevCollection => prevCollection.add(transaction));
     }, []);

     const getCompletedTransactions = useCallback(() => {
       return collection.getByStatus('completed');
     }, [collection]);

     return {
       collection,
       addTransaction,
       getCompletedTransactions,
       totalAmount: collection.getTotalAmount(),
       isEmpty: collection.isEmpty(),
     };
   };

   // React Component using the collection
   const TransactionSummary = ({ transactions }: { transactions: Transaction[] }) => {
     const { collection, totalAmount, isEmpty } = useTransactionCollection(transactions);

     if (isEmpty) {
       return <div>No transactions found</div>;
     }

     return (
       <div>
         <p>Total Transactions: {collection.toArray().length}</p>
         <p>Completed: {collection.getCompletedCount()}</p>
         <p>Total Amount: {totalAmount.getValue()}</p>
       </div>
     );
   };
   ```

5. **One Dot per Line**:
   - Limit the number of method calls in a single line to improve readability and maintainability.
   - This applies to both object method chaining and React prop drilling.

   ```typescript
   // Bad Example - Multiple method calls in a single line
   const processTransaction = (transaction: Transaction) => {
     const userEmail = transaction.getUser().getEmail().toUpperCase().trim();
     // Do something with userEmail
   };

   // Bad Example - Complex React prop access
   const UserProfile = ({ transaction }: { transaction: Transaction }) => {
     const userName = transaction.getUser().getProfile().getName().toUpperCase();
     return <div>{userName}</div>;
   };

   // Good Example - One method call per line
   const processTransaction = (transaction: Transaction) => {
     const user = transaction.getUser();
     const email = user.getEmail();
     const upperCaseEmail = email.toUpperCase();
     const userEmail = upperCaseEmail.trim();
     // Do something with userEmail
   };

   // Good Example - Using intermediate variables in React
   const UserProfile = ({ transaction }: { transaction: Transaction }) => {
     const user = transaction.getUser();
     const profile = user.getProfile();
     const name = profile.getName();
     const userName = name.toUpperCase();
     
     return <div>{userName}</div>;
   };

   // Good Example - Using functional composition
   const getUserEmail = (transaction: Transaction): string => {
     const user = transaction.getUser();
     const email = user.getEmail();
     return email.toUpperCase().trim();
   };

   const processTransaction = (transaction: Transaction) => {
     const userEmail = getUserEmail(transaction);
     // Do something with userEmail
   };

   // React Hook Example - Breaking down complex operations
   const useUserData = (transaction: Transaction) => {
     const user = useMemo(() => transaction.getUser(), [transaction]);
     const profile = useMemo(() => user.getProfile(), [user]);
     const email = useMemo(() => user.getEmail(), [user]);
     
     const formattedEmail = useMemo(() => {
       const upperCase = email.toUpperCase();
       return upperCase.trim();
     }, [email]);

     return { user, profile, formattedEmail };
   };

   // Good Example - Functional pipeline with single responsibility
   const pipe = <T>(...fns: Array<(arg: T) => T>) => (value: T) =>
     fns.reduce((acc, fn) => fn(acc), value);

   const processUserEmail = pipe(
     (transaction: Transaction) => transaction.getUser(),
     (user: User) => user.getEmail(),
     (email: string) => email.toUpperCase(),
     (email: string) => email.trim()
   );
   ```

6. **Don't Abbreviate**:
   - Use meaningful names for classes, functions, variables, and React components.
   - Avoid abbreviations that can lead to confusion.
   - Apply this to file names, component names, and prop names.

   ```typescript
   // Bad Example - Abbreviated names
   interface U {
     n: string;
     a: number;
   }

   const calcTxnAmt = (txns: any[]) => {
     return txns.reduce((acc, t) => acc + t.amt, 0);
   };

   const UsrProf = ({ u }: { u: U }) => {
     return <div>{u.n}</div>;
   };

   // Good Example - Meaningful names
   interface User {
     name: string;
     age: number;
   }

   const calculateTransactionAmount = (transactions: Transaction[]) => {
     return transactions.reduce((accumulator, transaction) => 
       accumulator + transaction.amount, 0
     );
   };

   const UserProfile = ({ user }: { user: User }) => {
     return <div>{user.name}</div>;
   };

   // Good Example - Clear React component and prop names
   interface TransactionListProps {
     transactions: Transaction[];
     onTransactionSelect: (transaction: Transaction) => void;
     isLoading: boolean;
   }

   const TransactionList = ({ 
     transactions, 
     onTransactionSelect, 
     isLoading 
   }: TransactionListProps) => {
     if (isLoading) {
       return <LoadingSpinner />;
     }

     return (
       <div>
         {transactions.map(transaction => (
           <TransactionItem
             key={transaction.id}
             transaction={transaction}
             onSelect={() => onTransactionSelect(transaction)}
           />
         ))}
       </div>
     );
   };

   // Good Example - Custom hook with clear naming
   const useTransactionManagement = () => {
     const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
     const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);

     const selectTransaction = useCallback((transaction: Transaction) => {
       setSelectedTransaction(transaction);
     }, []);

     const processSelectedTransaction = useCallback(async () => {
       if (!selectedTransaction) return;
       
       setIsProcessingTransaction(true);
       try {
         await transactionService.process(selectedTransaction);
       } finally {
         setIsProcessingTransaction(false);
       }
     }, [selectedTransaction]);

     return {
       selectedTransaction,
       isProcessingTransaction,
       selectTransaction,
       processSelectedTransaction,
     };
   };

   // File naming examples:
   // Good: TransactionList.tsx, UserProfile.tsx, PaymentService.ts
   // Bad: TxnList.tsx, UsrProf.tsx, PaySvc.ts
   ```

7. **Keep Entities Small (Classes, Functions, Components, Modules)**:
   - Limit the size of classes, functions, React components, and modules.
   - Each entity should have a single responsibility and be as small as possible.
   
   **Constraints:**
   - Maximum 10 functions per class/module
   - Maximum 50 lines per class/function/component
   - Maximum 10 components per feature module
   - React components should focus on single responsibility

   ```typescript
   // Bad Example - Large class with multiple responsibilities
   class UserTransactionManager {
     createUser(name: string) { /* 15 lines */ }
     deleteUser(id: string) { /* 12 lines */ }
     updateUser(id: string, data: any) { /* 18 lines */ }
     sendEmail(email: string) { /* 20 lines */ }
     processTransaction(transaction: Transaction) { /* 25 lines */ }
     validateTransaction(transaction: Transaction) { /* 15 lines */ }
     calculateFees(amount: number) { /* 10 lines */ }
     generateReport() { /* 30 lines */ }
     // Too many responsibilities!
   }

   // Good Example - Small classes with single responsibility
   class UserCreator {
     createUser(name: string): User {
       // Single responsibility: creating users
       // Maximum 50 lines
     }
   }

   class UserDeleter {
     deleteUser(id: string): void {
       // Single responsibility: deleting users
     }
   }

   class UserUpdater {
     updateUser(id: string, userData: UserData): User {
       // Single responsibility: updating users
     }
   }

   class TransactionProcessor {
     processTransaction(transaction: Transaction): ProcessedTransaction {
       // Single responsibility: processing transactions
     }
   }

   // Bad Example - Large React component (over 50 lines)
   const UserDashboard = ({ user }: { user: User }) => {
     const [transactions, setTransactions] = useState<Transaction[]>([]);
     const [accounts, setAccounts] = useState<Account[]>([]);
     const [notifications, setNotifications] = useState<Notification[]>([]);
     // ... lots of state and logic
     
     return (
       <div>
         {/* Complex JSX with multiple responsibilities */}
         <UserProfile user={user} />
         <TransactionList transactions={transactions} />
         <AccountSummary accounts={accounts} />
         <NotificationPanel notifications={notifications} />
         {/* 80+ lines of JSX */}
       </div>
     );
   };

   // Good Example - Small, focused components
   const UserDashboard = ({ user }: { user: User }) => {
     return (
       <div>
         <UserProfileSection user={user} />
         <TransactionSection />
         <AccountSection />
         <NotificationSection />
       </div>
     );
   };

   const UserProfileSection = ({ user }: { user: User }) => {
     // Single responsibility: displaying user profile
     // Less than 50 lines
     return <UserProfile user={user} />;
   };

   const TransactionSection = () => {
     const { transactions, isLoading } = useTransactions();
     
     if (isLoading) return <LoadingSpinner />;
     
     return <TransactionList transactions={transactions} />;
   };

   // Good Example - Small custom hooks (under 50 lines each)
   const useUserData = (userId: string) => {
     // Single responsibility: managing user data
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       // Fetch user logic
     }, [userId]);

     return { user, loading };
   };

   const useTransactions = () => {
     // Single responsibility: managing transactions
     const [transactions, setTransactions] = useState<Transaction[]>([]);
     // Transaction-specific logic only
     return { transactions, setTransactions };
   };

   // Module organization - max 10 components per feature
   // app/features/finance/
   //   components/
   //     TransactionList.tsx      (1)
   //     TransactionItem.tsx      (2)
   //     TransactionForm.tsx      (3)
   //     AccountSummary.tsx       (4)
   //     PaymentButton.tsx        (5)
   //     // ... max 10 components total
   ```


8. **No Classes with More Than Two Instance Variables**:
   - Encourage classes to have a single responsibility by limiting the number of instance variables.
   - Limit the number of instance variables to two to maintain simplicity.
   - For React: Custom hooks should manage maximum two primary state concerns.
   - Do not count utility dependencies (logger, etc.) as instance variables.

   ```typescript
   // Bad Example - Class with too many instance variables
   class UserTransactionHandler {
     private readonly userRepository: UserRepository;
     private readonly transactionRepository: TransactionRepository;
     private readonly emailService: EmailService;
     private readonly smsService: SmsService;
     private readonly logger: Logger; // Too many concerns

     constructor(
       userRepository: UserRepository,
       transactionRepository: TransactionRepository,
       emailService: EmailService,
       smsService: SmsService,
       logger: Logger
     ) {
       this.userRepository = userRepository;
       this.transactionRepository = transactionRepository;
       this.emailService = emailService;
       this.smsService = smsService;
       this.logger = logger;
     }
   }

   // Good Example - Class with two main instance variables
   class UserTransactionHandler {
     private readonly userRepository: UserRepository;
     private readonly notificationService: NotificationService;
     private readonly logger: Logger; // Utility - not counted as instance variable

     constructor(
       userRepository: UserRepository,
       notificationService: NotificationService,
       logger: Logger
     ) {
       this.userRepository = userRepository;
       this.notificationService = notificationService;
       this.logger = logger;
     }
   }

   // Bad Example - React hook managing too many concerns
   const useUserDashboard = (userId: string) => {
     const [user, setUser] = useState<User | null>(null);
     const [transactions, setTransactions] = useState<Transaction[]>([]);
     const [accounts, setAccounts] = useState<Account[]>([]);
     const [notifications, setNotifications] = useState<Notification[]>([]);
     const [preferences, setPreferences] = useState<UserPreferences | null>(null);
     // Too many state concerns in one hook

     return {
       user, setUser,
       transactions, setTransactions,
       accounts, setAccounts,
       notifications, setNotifications,
       preferences, setPreferences,
     };
   };

   // Good Example - Hook managing two primary concerns
   const useUserProfile = (userId: string) => {
     const [user, setUser] = useState<User | null>(null);
     const [preferences, setPreferences] = useState<UserPreferences | null>(null);
     // Two related concerns: user data and user preferences

     useEffect(() => {
       // Load user and preferences
     }, [userId]);

     return { user, preferences, updatePreferences: setPreferences };
   };

   // Good Example - Separate hooks for different concerns
   const useTransactions = (userId: string) => {
     const [transactions, setTransactions] = useState<Transaction[]>([]);
     const [loading, setLoading] = useState(false);
     // Two related concerns: data and loading state

     return { transactions, loading, refetch: () => {} };
   };

   const useNotifications = (userId: string) => {
     const [notifications, setNotifications] = useState<Notification[]>([]);
     const [unreadCount, setUnreadCount] = useState(0);
     // Two related concerns: notifications and count

     return { notifications, unreadCount, markAsRead: () => {} };
   };

   // Good Example - Domain service with focused responsibility
   class TransactionValidator {
     private readonly businessRules: BusinessRuleEngine;
     private readonly complianceChecker: ComplianceChecker;

     constructor(
       businessRules: BusinessRuleEngine,
       complianceChecker: ComplianceChecker
     ) {
       this.businessRules = businessRules;
       this.complianceChecker = complianceChecker;
     }

     validate(transaction: Transaction): ValidationResult {
       // Uses only two main dependencies for validation
       const rulesResult = this.businessRules.validate(transaction);
       const complianceResult = this.complianceChecker.check(transaction);
       
       return ValidationResult.combine(rulesResult, complianceResult);
     }
   }

   // React Component Example - Managing two primary concerns
   const TransactionForm = ({ onSubmit }: { onSubmit: (t: Transaction) => void }) => {
     const [formData, setFormData] = useState<TransactionFormData>(initialData);
     const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
     // Two concerns: form data and validation state

     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       const errors = validateForm(formData);
       
       if (Object.keys(errors).length === 0) {
         onSubmit(formData);
       } else {
         setValidationErrors(errors);
       }
     };

     return (
       <form onSubmit={handleSubmit}>
         {/* Form fields */}
       </form>
     );
   };
   ```

9. **No Getters/Setters in Domain Classes**:
   - Avoid exposing setters for properties in domain classes.
   - Use private constructors and static factory methods for object creation.
   - Apply immutability principles in domain modeling.
   - For React: Prefer immutable state updates and functional approaches.

   ```typescript
   // Bad Example - Exposing setters in domain class
   class User {
     public name: string;
     public email: string;
     public age: number;

     constructor(name: string, email: string, age: number) {
       this.name = name;
       this.email = email;
       this.age = age;
     }

     // Setters allow invalid state changes
     setAge(age: number) {
       this.age = age; // No validation!
     }

     setEmail(email: string) {
       this.email = email; // No validation!
     }
   }

   // Good Example - Domain class without setters
   class User {
     private constructor(
       private readonly _name: string,
       private readonly _email: EmailAddress,
       private readonly _age: Age
     ) {}

     static create(name: string, email: string, age: number): User {
       // Validation happens at creation
       if (!name.trim()) throw new Error('Name is required');
       
       return new User(
         name,
         EmailAddress.create(email),
         Age.create(age)
       );
     }

     get name(): string {
       return this._name;
     }

     get email(): string {
       return this._email.getValue();
     }

     get age(): number {
       return this._age.getValue();
     }

     // Business methods instead of setters
     changeEmail(newEmail: string): User {
       return new User(
         this._name,
         EmailAddress.create(newEmail), // Validation in EmailAddress
         this._age
       );
     }

     celebrateBirthday(): User {
       return new User(
         this._name,
         this._email,
         this._age.increment()
       );
     }
   }

   // Good Example - Immutable value object
   class Money {
     private constructor(
       private readonly _amount: number,
       private readonly _currency: string
     ) {}

     static create(amount: number, currency: string): Money {
       if (amount < 0) throw new Error('Amount cannot be negative');
       if (!currency) throw new Error('Currency is required');
       
       return new Money(amount, currency);
     }

     get amount(): number {
       return this._amount;
     }

     get currency(): string {
       return this._currency;
     }

     // Methods return new instances instead of mutating
     add(other: Money): Money {
       if (this._currency !== other._currency) {
         throw new Error('Cannot add different currencies');
       }
       return Money.create(this._amount + other._amount, this._currency);
     }

     multiply(factor: number): Money {
       return Money.create(this._amount * factor, this._currency);
     }
   }

   // React Example - Immutable state updates instead of setters
   const useUserProfile = (initialUser: User) => {
     const [user, setUser] = useState(initialUser);

     // Instead of setter methods, use business operations
     const changeUserEmail = useCallback((newEmail: string) => {
       setUser(currentUser => currentUser.changeEmail(newEmail));
     }, []);

     const celebrateUserBirthday = useCallback(() => {
       setUser(currentUser => currentUser.celebrateBirthday());
     }, []);

     return {
       user,
       changeEmail: changeUserEmail,
       celebrateBirthday: celebrateUserBirthday,
     };
   };

   // React Component Example - Immutable operations
   const UserEditor = ({ user, onUserChange }: { 
     user: User; 
     onUserChange: (user: User) => void; 
   }) => {
     const [emailInput, setEmailInput] = useState(user.email);

     const handleEmailSubmit = () => {
       try {
         const updatedUser = user.changeEmail(emailInput);
         onUserChange(updatedUser);
       } catch (error) {
         // Handle validation error
         console.error(error.message);
       }
     };

     return (
       <div>
         <input 
           value={emailInput}
           onChange={(e) => setEmailInput(e.target.value)}
         />
         <button onClick={handleEmailSubmit}>
           Update Email
         </button>
       </div>
     );
   };

   // Good Example - Transaction aggregate without setters
   class Transaction {
     private constructor(
       private readonly _id: TransactionId,
       private readonly _amount: Money,
       private readonly _status: TransactionStatus,
       private readonly _createdAt: Date
     ) {}

     static create(id: TransactionId, amount: Money): Transaction {
       return new Transaction(id, amount, 'pending', new Date());
     }

     get id(): TransactionId {
       return this._id;
     }

     get amount(): Money {
       return this._amount;
     }

     get status(): TransactionStatus {
       return this._status;
     }

     // Business methods instead of setters
     complete(): Transaction {
       if (this._status === 'completed') {
         throw new Error('Transaction already completed');
       }
       
       return new Transaction(this._id, this._amount, 'completed', this._createdAt);
     }

     cancel(): Transaction {
       if (this._status === 'completed') {
         throw new Error('Cannot cancel completed transaction');
       }
       
       return new Transaction(this._id, this._amount, 'cancelled', this._createdAt);
     }
   }
   ```

## Implementation Guidelines

### Domain Classes (TypeScript):
- Use private constructors and static factory methods for creating instances
- Avoid exposing setters for properties
- Use readonly modifiers and private fields
- Return new instances instead of mutating existing ones
- Implement business methods that express domain operations

### React Components:
- Use immutable state updates
- Prefer functional components with hooks
- Avoid direct state mutation
- Use business operations instead of generic setters

### Testing:
- Test business behavior rather than internal state
- Validate domain rules and invariants
- Test immutability and proper encapsulation

### Code Reviews:
- Enforce these rules during code reviews to maintain consistency
- Look for proper encapsulation and immutability
- Ensure business operations are expressive and domain-focused