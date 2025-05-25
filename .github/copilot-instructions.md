# Copilot Instructions for Nara Finance

## GitHub Copilot Agent Mode Guidelines

When working in this codebase, GitHub Copilot should:

1. **Follow Established Patterns**: Always examine existing code patterns before suggesting new implementations
2. **Maintain Type Safety**: Ensure all TypeScript types are properly defined and used
3. **Respect Architecture**: Follow the established React Router v7 + Cloudflare Workers architecture
4. **Use Project Tools**: Prefer Bun over npm/yarn, use Drizzle ORM for database operations
5. **Follow Styling Conventions**: Use Tailwind CSS utility classes and shadcn/ui components
6. **Implement Proper Error Handling**: Use try-catch blocks and return appropriate HTTP status codes
7. **Write Tests**: Include Vitest tests for new functionality
8. **Maintain Security**: Follow security best practices for financial applications

## Project Overview

Nara Finance is a full-stack personal finance management application built with modern web technologies. The application features expense tracking, income tax calculations for multiple countries, and a comprehensive dashboard for financial management.

### Key Features
- **Personal Finance Dashboard**: Track expenses, income, and categorize transactions
- **Income Tax Calculator**: Multi-country tax calculation support (US, UK, Canada, Australia, Germany, France, Japan)
- **Guest Book**: User interaction and feedback system
- **Authentication**: Secure user login and session management
- **Responsive Design**: Modern UI with dark/light theme support

## Technology Stack

### Frontend
- **React Router v7**: Modern React framework with file-based routing
- **React 18**: Latest React with hooks and modern patterns
- **TypeScript**: Full type safety throughout the application (v5.6+)
- **Tailwind CSS v4**: Utility-first CSS framework with CSS-in-JS
- **shadcn/ui**: Modern React component library with Radix UI
- **Vite**: Fast build tool and development server with Cloudflare plugin

### Backend
- **Cloudflare Workers**: Serverless edge computing platform
- **Hono**: Fast web framework for Cloudflare Workers (v4.x)
- **Drizzle ORM**: Type-safe SQL ORM for database operations (v0.30+)
- **SQLite/Cloudflare D1**: Database for development and production
- **Cloudflare Workers Pool**: Testing environment for Vitest

### Development Tools
- **Bun**: JavaScript runtime and package manager (v1.1.42+)
- **Vitest**: Testing framework with Cloudflare Workers pool
- **ESLint & Prettier**: Code formatting and linting
- **TypeScript**: Static type checking (v5.6+ with strict mode)
- **Commitlint**: Conventional commit message enforcement
- **Husky**: Git hooks for commit validation

### Additional Dependencies
- **React Hook Form**: Form handling with Zod validation
- **Recharts**: Chart visualization for financial data
- **Lucide React**: Icon library
- **clsx & class-variance-authority**: Utility for conditional classes
- **date-fns**: Date manipulation utilities

## Project Architecture

### File Structure Organization

```
/app                     # Frontend React application
  /components           # Reusable UI components
    /ui                 # shadcn/ui component library
  /hooks               # Custom React hooks
  /lib                 # Utility functions and helpers
  /routes              # React Router v7 file-based routes
/workers               # Cloudflare Workers backend
  /api                 # API route handlers
  /tests               # Backend API tests
/database              # Database schema and migrations
/public                # Static assets
/build                 # Production build output
```

### Routing Architecture

The application uses React Router v7 with file-based routing:

- **Landing Page**: `/_landing._index/` - Marketing and feature showcase
- **Dashboard**: `/app._index/` - Main application dashboard
- **Finance**: `/finance/` - Personal finance management
- **Income Tax**: `/income-tax/` - Multi-country tax calculator
- **Contacts**: `/contacts/` - Contact management (example feature)

### API Architecture

Backend API is built with Hono framework and follows RESTful conventions:

- **GET/POST `/api/transactions`**: Transaction CRUD operations
- **GET/POST `/api/categories`**: Category management
- **GET/POST `/api/book`**: Guest book operations
- **GET/POST `/api/posts`**: Post management
- **GET `/api/setup`**: Database initialization

## Database Schema

### Core Tables

```typescript
// Categories table for transaction categorization
categories: {
  id: number (primary key)
  name: string
  color: string
  description: string
  createdAt: timestamp
  updatedAt: timestamp
}

// Transactions table for financial records
transactions: {
  id: number (primary key)
  categoryId: number (foreign key to categories)
  amount: real (decimal amounts)
  description: string
  type: 'income' | 'expense'
  date: string (ISO date)
  createdAt: timestamp
  updatedAt: timestamp
}

// Guest book for user interactions
guestBook: {
  id: number (primary key)
  name: string
  email: string
  message: text
  createdAt: timestamp
}
```

### Relationships
- `transactions.categoryId` → `categories.id` (many-to-one)
- Categories can have multiple transactions
- Soft delete patterns are not implemented (direct deletion)

## Development Patterns

### Component Patterns

1. **UI Components**: Use shadcn/ui as the base component library
   ```typescript
   // Import pattern for UI components
   import { Button } from "~/components/ui/button"
   import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
   ```

2. **Route Components**: File-based routing with `route.tsx` files
   ```typescript
   // Route component structure
   export default function RouteName() {
     return <div>Content</div>
   }
   
   // For data loading
   export async function loader() {
     return { data: "value" }
   }
   ```

3. **Form Handling**: Use React Hook Form with TypeScript
   ```typescript
   import { useForm } from "react-hook-form"
   import { zodResolver } from "@hookform/resolvers/zod"
   ```

### API Patterns

1. **Hono Route Handlers**:
   ```typescript
   app.get('/api/endpoint', async (c) => {
     // Handler logic
     return c.json({ data: result })
   })
   
   app.post('/api/endpoint', async (c) => {
     const body = await c.req.json()
     // Process data
     return c.json({ success: true })
   })
   ```

2. **Database Operations**:
   ```typescript
   import { drizzle } from 'drizzle-orm/d1'
   import { categories, transactions } from '../database/schema'
   
   // Query pattern
   const db = drizzle(c.env.DB)
   const result = await db.select().from(transactions).where(...)
   ```

3. **Error Handling**:
   ```typescript
   try {
     // Operation
   } catch (error) {
     return c.json({ error: 'Error message' }, 500)
   }
   ```

### State Management

- **React Router Loaders**: For data fetching on route entry
- **React State**: useState for local component state
- **Form State**: React Hook Form for form management
- **Theme State**: Context-based theme switching

### Styling Conventions

1. **Tailwind Classes**: Use utility-first approach
2. **Component Variants**: Use cva (class-variance-authority) for component variants
3. **Dark Mode**: Implement theme switching with CSS variables
4. **Responsive Design**: Mobile-first responsive design patterns

## Testing Strategy

### Test Structure
- **Unit Tests**: Vitest for component and utility testing
- **API Tests**: Backend API endpoint testing
- **Test Location**: Tests are co-located in `/workers/tests/`

### Test Patterns
```typescript
import { describe, it, expect } from 'vitest'

describe('Feature', () => {
  it('should behave correctly', () => {
    // Test implementation
  })
})
```

## Build and Deployment

### Development Commands
```bash
bun install          # Install dependencies
bun dev             # Start development server
bun build           # Build for production
bun test            # Run tests
bun db:generate     # Generate database migrations
bun db:migrate      # Run database migrations
```

### Production Deployment
- **Platform**: Cloudflare Workers + Pages
- **Database**: Cloudflare D1 (SQLite)
- **Assets**: Cloudflare Pages for static assets
- **Configuration**: `wrangler.jsonc` for Cloudflare settings

## Key Configuration Files

### Core Configurations
- **package.json**: Dependencies and scripts
- **vite.config.ts**: Vite build configuration
- **react-router.config.ts**: React Router v7 configuration
- **drizzle.config.ts**: Database ORM configuration
- **wrangler.jsonc**: Cloudflare Workers configuration
- **tsconfig.json**: TypeScript configuration

### Environment Setup
- **Development**: Uses local SQLite database
- **Production**: Uses Cloudflare D1 database
- **Environment Variables**: Managed through Cloudflare Workers

## Code Quality Standards

### TypeScript Usage
- **Strict Mode**: Full TypeScript strict mode enabled
- **Type Safety**: All API responses and database queries are typed
- **Interface Definitions**: Consistent interface patterns

### Code Formatting
- **Prettier**: Automated code formatting
- **ESLint**: Code linting and best practices
- **Import Organization**: Consistent import patterns

### Commit Conventions
- **Commitlint**: Enforces conventional commit messages
- **Format**: `type(scope): description`
- **Examples**: `feat(finance): add transaction filtering`, `fix(api): resolve category deletion`

## Feature-Specific Guidelines

### Income Tax Calculator
- **Multi-Country Support**: Extensible tax calculation system
- **Tax Brackets**: Progressive tax calculation with bracket definitions
- **Currency Handling**: Proper decimal arithmetic for financial calculations
- **Form Validation**: Comprehensive input validation with error messages

### Finance Dashboard
- **Transaction Management**: CRUD operations with category linking
- **Data Visualization**: Chart.js integration for financial charts
- **Filtering**: Date range and category-based filtering
- **Real-time Updates**: Optimistic updates for better UX

### UI/UX Patterns
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages
- **Form Feedback**: Immediate validation feedback
- **Navigation**: Consistent sidebar navigation with active states

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Lazy load non-critical components
- **Memoization**: React.memo for expensive components
- **Bundle Size**: Monitor and optimize bundle size

### Backend Optimization
- **Database Queries**: Optimize SQL queries with proper indexing
- **Caching**: Implement appropriate caching strategies
- **Edge Computing**: Leverage Cloudflare Workers edge locations

## Security Considerations

### Authentication
- **Session Management**: Secure session handling
- **Route Protection**: Protected routes for authenticated users
- **Input Validation**: Server-side input validation
- **SQL Injection**: Use parameterized queries through Drizzle ORM

### Data Protection
- **Sensitive Data**: Proper handling of financial information
- **HTTPS**: Enforce HTTPS in production
- **Environment Variables**: Secure configuration management

## Common Development Tasks

### Adding New Features
1. Create route file in `/app/routes/`
2. Add API endpoints in `/workers/api/`
3. Update database schema if needed
4. Add tests for new functionality
5. Update documentation

### Database Changes
1. Modify schema in `/database/schema.ts`
2. Generate migration: `bun db:generate`
3. Apply migration: `bun db:migrate`
4. Update API handlers as needed

### UI Component Development
1. Use shadcn/ui as base components
2. Follow existing component patterns
3. Implement responsive design
4. Add proper TypeScript types
5. Test component functionality

## Debugging and Troubleshooting

### Common Issues
- **Build Errors**: Check TypeScript errors and dependencies
- **Database Issues**: Verify schema and migration status
- **API Errors**: Check Cloudflare Workers logs
- **Routing Issues**: Verify React Router v7 file structure

### Development Tools
- **Browser DevTools**: For frontend debugging
- **Cloudflare Dashboard**: For Workers and D1 monitoring
- **Console Logging**: Strategic logging for debugging
- **Type Checking**: Regular TypeScript compilation checks

---

This documentation should be updated as the project evolves. Always maintain consistency with established patterns and conventions when adding new features or making modifications.
