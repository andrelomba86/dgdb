# DGDB Agent Guide

## Setup
1. Install dependencies: `npm install`
2. Generate Prisma client: `npx prisma generate` (or `npm run prisma:generate`)
3. Initialize MySQL database: `mysql -u root -p < init-db.sql`
4. Seed admin user: `npm run prisma:seed`
5. Ensure `.env` contains:
   - DATABASE_URL="mysql://root:senha@localhost:3306/dg"
   - ADMIN_LOGIN="admin"
   - ADMIN_PASSWORD="admin123456"

## Development
- Start dev server: `npm run dev` (uses Turbopack: `next dev --turbopack`)
- Typecheck: `npm run typecheck` (runs `tsc --noEmit`)
- Build for production: `npm run build`
- Start production server: `npm start`

## Testing
- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- Integration tests (local DB): `npm run test:integration:db:local`
- End-to-end tests: `npm run e2e`
- Test coverage: `npm run test:coverage`
- CI pipeline: `npm run test:ci` (runs typecheck, test:coverage, test:integration, e2e)

## Project Structure
- `/app` - Next.js App Router routes
- `/src/actions` - Server actions
- `/src/components` - Reusable components
- `/src/lib` - Utilities, auth, export functions (PDF/CSV export uses pdf-lib)
- `/src/repositories` - Data access layer
- `/src/services` - Business logic
- `/src/types` - Domain TypeScript types
- `/src/validators` - Zod validation schemas
- `/prisma` - Prisma schema and seed script

## Key Notes
- Admin credentials come from `.env` variables after seeding
- Protected routes use session-based HTTP-only cookies
- Prisma seed script: `node prisma/seed.mjs` (creates admin user based on ADMIN_LOGIN/ADMIN_PASSWORD)
- Test environment uses Vitest with Node.js environment and globals
- Coverage thresholds: lines 78%, functions 85%, branches 60%, statements 78%
- Alias `@` maps to `/src` directory (configured in vitest.config.ts)