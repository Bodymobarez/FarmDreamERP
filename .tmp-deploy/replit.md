# Farm ERP Management System

## Overview

This is a comprehensive Farm ERP (Enterprise Resource Planning) system designed specifically for livestock management in Arabic-speaking regions. The application provides tools for tracking animals, weights, feeds, treatments, expenses, and generating detailed performance reports. It features a bilingual interface with full RTL (Right-to-Left) support for Arabic and includes data visualization capabilities for farm analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & UI Library**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** for utility-first styling with custom agricultural-themed design system

**Design System**
- Material Design 3 principles adapted for agricultural applications
- Custom color palette inspired by farming environment (greens, browns, earth tones)
- Full RTL support for Arabic language
- Touch-friendly interface optimized for tablet/mobile farm usage
- Card-based layouts for organized data presentation

**State Management & Data Fetching**
- **TanStack React Query (v5)** for server state management, caching, and data synchronization
- Custom query client with credential-based authentication
- Optimistic updates disabled (staleTime: Infinity) for data consistency

**UI Components**
- **Shadcn/ui** component library with Radix UI primitives
- Custom agricultural-specific components (AnimalCard, WeightChart, TreatmentCard, etc.)
- **Recharts** for data visualization (line charts, bar charts, pie charts)
- Comprehensive form handling with React Hook Form and Zod validation

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for API endpoints
- Custom middleware for request logging and error handling
- Session-based authentication (infrastructure prepared, not yet implemented)
- Modular route registration system

**Development Server Integration**
- Vite middleware mode for HMR (Hot Module Replacement) in development
- SSR-ready architecture with custom HTML template handling
- Replit-specific plugins for enhanced development experience

**Storage Layer**
- Abstracted storage interface (`IStorage`) for flexible data persistence
- In-memory storage implementation (`MemStorage`) as default
- Database-ready architecture supporting easy migration to persistent storage

### Data Storage Solutions

**Database Infrastructure**
- **PostgreSQL** via Neon serverless with WebSocket support
- **Drizzle ORM** for type-safe database operations
- Schema-first approach with automatic TypeScript type generation
- Connection pooling for optimized database performance

**Schema Design**
- Initial user authentication schema (users table with username/password)
- Prepared for agricultural data models (animals, weights, treatments, inventory, expenses)
- Migration system via Drizzle Kit for version-controlled schema changes

### Authentication & Authorization

**Authentication Strategy**
- Session-based authentication using `connect-pg-simple` for PostgreSQL session store
- User credentials stored with secure password hashing (implementation pending)
- Session persistence across server restarts via database

**Authorization Model**
- Foundation laid for role-based access control
- User schema supports extensible authentication patterns

### External Dependencies

**Third-Party UI Libraries**
- **Radix UI** - Comprehensive collection of unstyled, accessible components (accordion, dialog, dropdown, popover, select, tabs, toast, etc.)
- **Lucide React** - Icon library for consistent UI iconography
- **Recharts** - Charting library for data visualization
- **Embla Carousel** - Touch-friendly carousel component
- **cmdk** - Command palette/search component
- **date-fns** - Date manipulation and formatting

**Development Tools**
- **Drizzle Kit** - Database migration and introspection tools
- **Replit Vite Plugins** - Development experience enhancements (runtime error overlay, cartographer, dev banner)

**Build & Deployment**
- **esbuild** - Fast JavaScript bundler for server-side code
- **tsx** - TypeScript execution for development
- **PostCSS & Autoprefixer** - CSS processing pipeline

**Type Safety & Validation**
- **Zod** - Runtime type validation and schema definition
- **drizzle-zod** - Integration between Drizzle ORM and Zod for schema validation
- **@hookform/resolvers** - Form validation resolver for React Hook Form with Zod

**Database & Connectivity**
- **@neondatabase/serverless** - Serverless PostgreSQL driver with WebSocket support
- **ws** - WebSocket library for database connections
- **connect-pg-simple** - PostgreSQL session store for Express sessions

### Key Architectural Decisions

**Monorepo Structure**
- Shared schema definitions between client and server (`/shared` directory)
- Type sharing ensures consistency across frontend and backend
- Centralized configuration for build tools and TypeScript

**RTL-First Design**
- HTML `dir="rtl"` and `lang="ar"` set at document level
- Cairo and Inter fonts for Arabic and Latin text respectively
- Tailwind configured for RTL-aware spacing and layouts

**Data Import Capability**
- Excel import functionality prepared for bulk animal/weight data
- Analysis document included for understanding farm data structure
- Support for complex multi-row headers and wide-format weight measurements

**Responsive & Mobile-First**
- Touch-optimized UI with large interactive elements
- Responsive grid layouts adapting from mobile to desktop
- Mobile breakpoint detection hook (`use-mobile.tsx`)

**Theme System**
- Light/dark mode support with localStorage persistence
- CSS custom properties for dynamic theming
- Elevated interaction states for better visual feedback

**Page Structure**
- Dashboard - Overview with KPIs and quick actions
- Animals - Individual animal management and tracking
- Weights - Weight recording and import functionality
- Pens/Batches - Group management by location and batch
- Inventory - Feed and medicine stock management
- Treatments - Veterinary treatment logging
- Expenses - Financial tracking and cost analysis
- Reports - Comprehensive analytics and performance metrics
- KPI - Dedicated key performance indicators dashboard