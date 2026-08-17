# Notes

Thank you for the opportunity.

## Architecture

Application is built using Next.js App Router. The UI is separated into two route groups `src/app/(auth)` for public auth screens (`login` || `register`) and `src/app/(protected)` for routes that require the user be authenticated.

All my API routes (login, registration) live in `src/app/api`, I implemented the suggested endpoints as it is sensible that these might be required externally. Shared server utilities such as the Prisma client, session helpers, and Zod schemas—inside `src/lib`. I try to keep the routing, UI, and database logic separated while keeping to standard Next.js conventions.

## Authentication

Setup email and password auth.

For registration, I validate the incoming data with Zod, hash the password using bcryptjs, save the user, and create a session. On login, I check the password against the hash and, if it matches, I create a session.

The session token is stored in an HTTP-only cookie (set to `sameSite: "lax"`, a 7-day expiry, and `secure` in production). I check for this session both in `src/proxy.ts` and inside my protected server components. If a user isn't authenticated, they get redirected back to `/login`.

I chose this approach because it is simple, self-contained, and best fits the scope of this assessment.

## Database

I used SQLite with Prisma. I chose SQLite because it makes local setup incredibly easy without needing a standalone database server. Prisma gives great type safety and clean database access.

I set up two main models:

- **User**: Holds the account details, hashed password, current balance, and timestamps.
- **Transaction**: Tracks the history of credits and debits (amount, type, description, etc.).

I keep the user's total balance directly on the `User` record so it's fast to query and display. Whenever a balance changes, I wrap the balance update and the new transaction log in a single Prisma transaction to guarantee they stay perfectly in sync.

## Server vs. Client Components

Components default to Server Components, these I used for anything that needs secure data access, like reading cookies, checking sessions, or hitting the database (e.g., the protected layout, dashboard, and nav bar). This keeps the client-side bundle small and secure.

I only add in Client Components where I needed browser interactivity like the login/register forms, buttons, or when navigating with `useRouter`.

## If Given Another Day

I would improve the application by:

- **Prisma**: taking a second look a the prisma models I added, it seems you can add relations, I just need sometime to understand the value of this.

- **Session management**:
  - decreasing duplication, maybe add a function to get the current user session.
  - rethink where/when I validate a session, I think there are currently to many checks.
  - verify email on registration. 

- **API routes**:
  - improve API response object consistency by returning a shared shape such as `{ success, message, data }` across endpoints.
  - have the redeem endpoint own the full purchase flow for simplicity.

- **Frontend**:
  - cleanup validation
  - improve the handling of different states loading, error etc.
  - add e2e tests
