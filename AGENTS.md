# Agent Coding Standards & Project Guidelines

This document outlines the coding standards, technology stack, and best practices for AI agents working on the **FiTracker** project. Please follow these guidelines to ensure consistency and maintainability.

## 1. Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Library:** [Shadcn UI](https://ui.shadcn.com/) (based on Radix Primitives)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** [Jotai](https://jotai.org/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Database:** MongoDB (via [Mongoose](https://mongoosejs.com/))
- **Authentication:** [Auth0](https://auth0.com/)

## 2. Project Structure

The project follows the standard Next.js `src` directory structure:

- `src/app`: App Router pages, layouts, and route handlers.
- `src/components`: React components.
  - `src/components/ui`: Reusable UI components (Shadcn).
  - `src/components/portfolio`: Feature-specific components (e.g., Portfolio).
- `src/lib`: Utility functions and shared logic.
  - `src/lib/utils.ts`: Contains the `cn` utility for class merging.
- `src/types`: TypeScript type definitions.
- `src/server`: Server-side logic (database models, utils).

## 3. Coding Standards

### TypeScript

- **Strict Mode:** Enabled. Ensure all types are properly defined.
- **Interfaces vs Types:** Use `interface` for object definitions and `type` for unions/primitives, but consistency is key.
- **Props:** Define component props as an interface or type, typically named `<ComponentName>Props`.
- **No `any`:** Avoid using `any`. Use `unknown` if necessary, but prefer specific types.
- **Variable Declarations:** Always prefer `const`. Only use `let` if you absolutely must reassign the variable. Avoid `var` entirely.

### Components

- **Functional Components:** Use React Functional Components.
- **Naming:** PascalCase for component files (e.g., `FiTracker.tsx`) and component names.
- **Exports:** Use named exports for components (e.g., `export function FiTracker...`).
- **Server vs Client:** Use `"use client"` directive only when necessary (interactivity, hooks). Default to Server Components.

### Styling (Tailwind CSS)

- **Utility First:** Use Tailwind utility classes for styling.
- **Class Merging:** Use the `cn` utility (from `@/lib/utils`) when merging classes or allowing `className` overrides.
  ```tsx
  import { cn } from '@/lib/utils';
  // ...
  <div className={cn('bg-primary text-white', className)}>...</div>;
  ```
- **CSS Variables:** Use the defined CSS variables (e.g., `bg-background`, `text-foreground`) to ensure theme compatibility (Dark/Light mode).
- **Responsive Design:** Use mobile-first prefixes (e.g., `md:grid-cols-3`).

### State Management

- **Local State:** Use `useState` or `useReducer`.
- **Global State:** Use `Jotai` atoms for shared client-side state.
- **Server State:** Rely on Next.js caching and revalidation where possible.

### Data Fetching

- **Server Components:** Fetch data directly in Server Components using `async/await`.
- **Server Actions:** Use Server Actions for mutations and form submissions.

## 4. Workflow for Agents

1.  **Explore First:** Before creating new components, check `src/components/ui` to see if a suitable primitive exists.
2.  **Check Dependencies:** Review `package.json` before suggesting new libraries. Use what is already installed.
3.  **Follow Patterns:** Match the coding style of existing files.
4.  **Verification:** When modifying code, verify that the changes render correctly and do not introduce type errors.
5.  **Build Sparingly:** Do NOT run `npm run build` or `yarn build` after every minor change on files. This project uses `yarn dev`, which provides hot module replacement. Only run a full build if you are verifying a complex change or before major checkpoints. Rely on type checking and the dev server status to ensure code correctness.

## 5. Common Patterns

### Creating a New UI Component

If you need a standard UI element (button, input, card), check if it exists in `src/components/ui`. If not, and it's a standard Shadcn component, you may suggest adding it via `npx shadcn@latest add <component>`.

### Database Models

Mongoose models are located in `src/server/models` (or similar, check `src/server`). Ensure schemas are typed.

### Icons

Import icons from `lucide-react`.

```tsx
import { Check, AlertCircle } from 'lucide-react';
```
