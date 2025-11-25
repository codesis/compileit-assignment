# Compileit assignment

Next.js + TypeScript single page application backed by SQLite (via `better-sqlite3`) to reserve the five meeting rooms available every weekday between 08:00 and 17:00. Weekends are intentionally blocked, as well passed days and timeslots.

## Features

- Five predefined rooms with distinct capacities.
- One-hour slots from 08:00–17:00 (last booking starts at 16:00).
- Bookings restricted to Monday–Friday to encourage no-weekend meetings.
- Possibility to book multiple rooms at once for better user experience.
- SQLite schema initializes automatically and prevents double-booking a slot.
- Interactive schedule (with the selected date/month rendered as headers) plus an inline booking form.

## Future improvements

- Implement routing for better user experience as now you need to reload the page to return home.
- Add buttons to move backwards, with or without routing.
- Add information by the booking form regarding what or which rooms that will be booked.
- Add possibility to save the information either in your calendar or get it by email.

## Getting Started

```bash
npm install
# run development
npm run dev
# build for production
npm run build
# run production
npm run start
# format files with prettier
npm run format
# clean db files
npm run db:clean
```

The development server defaults to http://localhost:3000.

## Environment

The SQLite database file lives in `data/rooms.db` (created automatically the first time the dev server runs).
