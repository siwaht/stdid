# Overview

This is a Student ID Card Generator application built with React and Express. The application allows users to create digital student ID cards by filling out student information forms and uploading photos, then generating downloadable ID cards in PNG or PDF format. The project uses a modern full-stack architecture with a React frontend powered by shadcn/ui components and an Express backend with PostgreSQL database integration via Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and design system consistency
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with custom hooks for ID card data management
- **Data Fetching**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage) for development
- **API Design**: RESTful API structure with /api prefix for all endpoints
- **File Handling**: Client-side file upload and processing for student photos

## Component Structure
- **UI Components**: Comprehensive set of reusable components including buttons, forms, dialogs, and file upload
- **Custom Hooks**: Specialized hooks for ID card data management (useIdCard) and mobile responsiveness (useIsMobile)
- **Page Components**: Dedicated pages for ID card generation and 404 handling
- **Layout System**: Responsive design with mobile-first approach using Tailwind breakpoints

## Development Environment
- **Build System**: Vite with React plugin for fast development and optimized production builds
- **Development Tools**: Replit-specific plugins for enhanced development experience
- **Type Safety**: Full TypeScript coverage across frontend and backend with strict compiler options
- **Code Organization**: Monorepo structure with shared types and schemas between client and server

## Data Flow
- **Client-Side Processing**: Image upload and form validation handled entirely on the frontend
- **ID Card Generation**: Browser-based ID card rendering with potential for server-side PDF generation
- **Database Operations**: User management and data persistence through Drizzle ORM with PostgreSQL

# External Dependencies

## Database
- **PostgreSQL**: Primary database with connection via DATABASE_URL environment variable
- **Neon Database**: Cloud PostgreSQL provider (@neondatabase/serverless) for serverless database connections
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support

## UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom design system integration
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **class-variance-authority**: Utility for managing component variants and conditional styling

## Development and Build Tools
- **Vite**: Modern build tool with React plugin for development and production builds
- **TypeScript**: Static type checking across the entire application stack
- **ESBuild**: Fast JavaScript bundler used by Vite for optimized builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins

## Client-Side Libraries
- **TanStack Query**: Server state management with caching, background updates, and error handling
- **React Hook Form**: Form state management with minimal re-renders and validation
- **Zod**: Schema validation library for type-safe form validation and API contracts
- **date-fns**: Date manipulation and formatting utilities
- **Wouter**: Lightweight routing library for single-page application navigation

## File Processing
- **HTML2Canvas**: Client-side library for capturing DOM elements as images
- **jsPDF**: PDF generation library for creating downloadable ID card documents
- **File Upload Handling**: Custom file upload component with drag-and-drop support and validation

## Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions (configured but not actively used in current implementation)

## Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for improved debugging
- **@replit/vite-plugin-cartographer**: Code mapping and navigation tools
- **@replit/vite-plugin-dev-banner**: Development environment indicators