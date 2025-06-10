# Copilot instructions

## Language Policy

All instructions and prompts in this repository must be written in English. This applies to:
- All rule and instruction files in `.github/instructions/`
- All prompt files in `.github/prompts/`
- All documentation and code comments intended for contributors

## Development code generation

When working with TypeScript and React code, follow these instructions very carefully.

It is **EXTREMELY important that you follow the instructions in the rule files very carefully.**

### Workflow implementation

**IMPORTANT:** Always follow these steps when implementing new features:

1. Consult any relevant instructions files listed below and start by listing which rule files have been used to guide the implementation (e.g. `Instructions used: [react-router-v7.instructions.md, clean-architecture.instructions.md]`).

2. Follow TDD when it is possible. Always start new changes by writing new test cases (or changing existing tests). 
Remember to consult [Unit and Integration Tests](./instructions/unit-and-integration-tests.instructions.md) for details on how to write tests with Vitest.

3. Always run `bun test` or `bun run typecheck` to verify that all tests pass and TypeScript compilation is successful before committing your changes. 
Don't ask to run the tests, just do it. If you are not sure how to run the tests, ask for help. 
You can also use `bun test --watch` to run the tests automatically when you change the code.

4. Fix any TypeScript compilation errors, linting warnings, and test failures before going to the next step.

### Project Structure Guidelines

When you see paths like `app/features/[feature]/` in rules, replace `[feature]` with the name of the feature you are working on (e.g. `finance`, `transactions`).

### Technology Stack

This project uses:
- **Frontend**: React 18+ with TypeScript
- **Framework**: React Router v7 (Framework Mode)
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Testing**: Vitest with @cloudflare/vitest-pool-workers
- **UI Components**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: Drizzle ORM with Cloudflare D1
- **Runtime**: Cloudflare Workers
- **Forms**: React Hook Form with Zod validation