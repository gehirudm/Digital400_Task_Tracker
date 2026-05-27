# Digital400 Task Tracker

A Kanban-style task management application built with Next.js 16, Supabase, GraphQL, and Prisma.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui
- **Auth:** Supabase Auth (email/password, Google OAuth, GitHub OAuth)
- **API:** GraphQL (Pothos + Yoga) via Next.js Route Handlers
- **Database:** Supabase PostgreSQL, Prisma ORM
- **Drag & Drop:** @dnd-kit
- **Monitoring:** Sentry
- **Linting:** ESLint 9 flat config, Prettier

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- A Supabase project

### Setup

```bash
# Clone and install
git clone <repo-url>
cd Digital400_Task_Tracker
pnpm install

# Create environment file
cp .env.example .env
# Fill in your Supabase and Sentry credentials in .env

# Generate Prisma client
pnpm postinstall

# Push database schema
pnpm db:push
```

### Development

```bash
pnpm dev        # Start dev server (Turbopack)
pnpm lint       # Run ESLint
pnpm lint:fix   # Auto-fix lint issues
pnpm build      # Lint + production build
```

Open [http://localhost:3000](http://localhost:3000).

### Database

```bash
pnpm db:push      # Push schema to database
pnpm db:generate  # Regenerate Prisma client
pnpm db:studio    # Open Prisma Studio
```

## Project Structure

```
app/                    # Next.js App Router pages
  (auth)/               # Auth route group (login, signup)
  (dashboard)/          # Protected route group
  api/graphql/          # GraphQL endpoint
components/
  atoms/                # shadcn/ui primitives
  molecules/            # Composed components (TaskCard, AuthForm, etc.)
  organisms/            # Complex sections (KanbanBoard, Sidebar, etc.)
hooks/                  # Custom React hooks
lib/                    # Shared utilities
  graphql/              # Pothos schema, resolvers, operations
  prisma/               # Prisma client
  supabase/             # Supabase server + browser clients
prisma/                 # Prisma schema
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase PostgreSQL connection string (PgBouncer) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable key |
| `SENTRY_AUTH_TOKEN` | No | Sentry auth token for source maps |
