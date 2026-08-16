# Sebenza Tech Assessment

A Next.js application for user registration, login, balance management, WiFi bundle redemption, and transaction history.

## Installation

Install the project dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="replace-with-a-long-random-secret"
```

`DATABASE_URL` is used by Prisma and the SQLite adapter to connect to the local database.

`SESSION_SECRET` is used to sign and verify JWT session cookies. Use a long random value and do not commit it to source control.

## Database Setup

This project uses SQLite with Prisma ORM.

Generate the Prisma client:

```bash
npm run prisma:gen
```

Create or sync the local database from the Prisma schema:

```bash
npm run prisma:db:push
```

Optional: open Prisma Studio to inspect the local database:

```bash
npm run prisma:studio
```

## How to Run the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Create an account from the register page, to view the dashboard, balance, bundles, and transaction history.

## Production Build

Build and start the production server:

```bash
npm run build
npm run start
```

## Useful Commands

Run lint checks:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npm run typecheck
```
