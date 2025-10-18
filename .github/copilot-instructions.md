# Maaz Mustafa Portfolio - GitHub Copilot Instructions

## Project Overview

Maaz Mustafa Portfolio is a modern portfolio built with Next.js 15, TypeScript, and Tailwind CSS v4. The project uses the new App Router architecture and follows strict development practices with comprehensive tooling.

## Architecture & Key Patterns

### Core Stack

- **Next.js 15** with App Router (`src/app/`) and Turbopack for dev/build
- **React 19** with strict TypeScript configuration
- **Tailwind CSS v4** with inline theme configuration and CSS custom properties
- **Prisma ORM** with PostgreSQL database and type-safe client
- **Font Strategy**: Geist Sans/Mono fonts loaded via `next/font/google` with CSS variables

### Project Structure

```
src/
├── app/                 # App Router pages and layouts
├── components/ui/       # Reusable UI components (follow shadcn/ui patterns)
├── hooks/              # Custom React hooks with SSR-safe implementations
├── lib/                # Utility functions and shared logic (includes prisma.ts)
├── types/              # TypeScript definitions (API responses, pagination)
├── styles/             # Global CSS with Tailwind and theme variables
└── utils/              # Pure utility functions

prisma/
├── schema.prisma       # Database schema and models
└── migrations/         # Database migration files (auto-generated)
```

### Critical Conventions

#### Import Aliases

- Use `@/*` path mapping for all src imports: `import { cn } from '@/lib/utils'`
- Never use relative imports for src files

#### CSS & Styling

- **Tailwind v4 Syntax**: Uses new `@theme inline` directive in `globals.css`
- **Class Utility**: Always use `cn()` from `@/lib/utils` for conditional classes
- **Theme Variables**: Custom properties in `:root` with dark mode via `prefers-color-scheme`
- **Font Variables**: `--font-geist-sans` and `--font-geist-mono` applied in layout

#### TypeScript Patterns

- **API Types**: Use `ApiResponse<T>` and `PaginatedResponse<T>` from `@/types`
- **Strict Config**: `strict: true`, no implicit any, enforce proper typing
- **Component Props**: Use `Readonly<{}>` wrapper for children props

#### Database Patterns

- **Prisma Client**: Import from `@/lib/prisma` - singleton instance with global caching
- **Schema Definition**: All models in `prisma/schema.prisma` with proper relations and indexes
- **Type Safety**: Use Prisma-generated types, never manual database types
- **Queries**: Prefer Prisma Client methods over raw SQL for type safety

#### React Hooks

- **SSR Safety**: All custom hooks handle `typeof window === 'undefined'` checks
- **Local Storage**: Use `useLocalStorage<T>` hook with proper error handling
- **Toast Notifications**: Use `useToast()` hook for consistent notification patterns
- **Hook Exports**: Centralized in `@/hooks/index.ts`

#### Utility Patterns

- **Toast Notifications**: Import `toast` from `@/lib/toast` or use `useToast()` hook for React components
- **Date/Time Formatting**: Use `dateTime` utility from `@/lib/datetime` for professional formatting
  - `dateTime.format(date, 'professional')` for business contexts
  - `dateTime.relative(date)` for "time ago" display
  - `dateTime.business(date)` for formal date presentation
  - `dateTime.calendar(date)` for smart calendar display
- **Utility Exports**: All utilities available from `@/lib/index.ts` for convenience imports

## Development Workflow

### Essential Commands

```bash
npm run dev          # Start with Turbopack (faster than webpack)
npm run build        # Production build with Turbopack
npm run lint         # ESLint with auto-fix
npm run format       # Prettier with Tailwind plugin
npm run type-check   # TypeScript validation without emit

# Database Commands
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database (development)
npm run db:migrate   # Create and apply migration (development)
npm run db:studio    # Open Prisma Studio
```

### Quality Controls

- **ESLint Config**: Flat config with Next.js, TypeScript, React, a11y, and unused imports rules
- **Prettier**: Includes `prettier-plugin-tailwindcss` for class sorting

### Code Quality Rules

1. **ESLint Violations**: Fix automatically with `npm run lint` before committing
2. **Import Organization**: Use `eslint-plugin-unused-imports` - remove unused, sort imports
3. **Accessibility**: `eslint-plugin-jsx-a11y` enforced - include proper ARIA labels
4. **React Patterns**: Hooks rules enforced, proper dependency arrays required

## Integration Points

### External Dependencies

- **shadcn/ui**: Modern component library with Radix UI primitives and Tailwind CSS styling
- **lucide-react**: Icon library used by shadcn/ui components
- **clsx + tailwind-merge**: Combined in `cn()` utility for robust class merging
- **Sonner**: Toast notification library integrated with theme system
- **dayjs**: Professional date/time formatting and manipulation library
- **Next.js Features**: Uses `next/font`, `next/image` with proper optimization
- **Build System**: Turbopack enabled for both dev and production builds
- **Prisma ORM**: Type-safe database access with PostgreSQL backend
- **TypeScript**: Strict typing across the entire codebase
- **Tailwind CSS v4**: Latest version with inline theming and custom properties
- **Husky + lint-staged**: Git hooks for pre-commit code quality enforcement
- **ESLint + Prettier**: Comprehensive linting and formatting setup
- **VSCode Extensions**: Recommended extensions include ESLint, Prettier, Tailwind CSS IntelliSense, Prisma, and shadcn/ui MCP
- **Better Auth**: Authentication handled via NextAuth.js or custom solution (not included in this snippet)

### API Patterns

- **Response Structure**: All APIs should return `ApiResponse<T>` format
- **Pagination**: Use `PaginationParams` and `PaginatedResponse<T>` for lists
- **Type Safety**: Define API response types in `@/types/index.ts`

## Component Development

### UI Component Guidelines

- **shadcn/ui Integration**: Use shadcn/ui components from `@/components/ui/` for consistent design
- **Component Installation**: Install new components via `npx shadcn@latest add [component-name]`
- **Custom Primary Colors**: Project uses custom primary color palette (`#` family with OKLCH variants)
- **Theme Configuration**: Colors defined in CSS custom properties with light/dark mode support
- **Component Styling**: Use `cn()` utility for conditional classes, follow shadcn/ui patterns
- **MCP Support**: shadcn/ui MCP extension (`suhelmakkad.shadcn-ui`) installed for AI-guided component development
- **Available Components**: Button, Card, Badge (base set) - expand as needed with `shadcn add`

### Page Development

- App Router pages go in `src/app/`
- Use proper metadata exports for SEO
- Implement loading.tsx, error.tsx, not-found.tsx as needed
- Follow the established layout pattern with font variables

## Performance & Optimization

- **Turbopack**: Always use for builds (`--turbopack` flag in scripts)
- **Font Loading**: Geist fonts with proper variable setup and `font-display: swap`
- **Image Optimization**: Use `next/image` with proper sizing and priority flags
- **CSS**: Leverage Tailwind's tree-shaking and CSS custom properties for theming
