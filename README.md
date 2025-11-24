# Compileit assignment

Next.js + TypeScript application backed by SQLite (via `better-sqlite3`) to reserve the five meeting rooms available every weekday between 08:00 and 17:00. Weekends are intentionally blocked.

## Features

- Five predefined rooms with distinct capacities.
- One-hour slots from 08:00–17:00 (last booking starts at 16:00).
- Bookings restricted to Monday–Friday to encourage no-weekend meetings.
- Possibility to book multiple rooms at once for better user experience.
- SQLite schema initializes automatically and prevents double-booking a slot.
- Interactive schedule (with the selected date/month rendered as headers) plus an inline booking form.

## Getting Started

```bash
npm install
npm run dev
```

The development server defaults to http://localhost:3000.

## Environment

The SQLite database file lives in `data/rooms.db` (created automatically the first time the dev server runs). Delete the file if you want a clean slate.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
