# Compileit assignment

Next.js + TypeScript single page application backed by SQLite (via `better-sqlite3`) to reserve the five meeting rooms available every weekday between 08:00 and 17:00. Weekends are intentionally blocked, as well passed days and timeslots.

Phase two of the assignment removes the possibility to see all the available slots in the calendar and instead lets the user book a room for a duration of their own choosing. Weekends are still intentionally blocked as well as passed days and timeslots. Users can choose a date within the upcoming two weeks, excluding weekends, and pick a duration for the meeting from 15 minutes up to 8 hours.

## Features

- Five predefined rooms with distinct capacities.
- Bookings restricted to Monday–Friday to encourage no-weekend meetings.
- SQLite schema initializes automatically and prevents double-booking a slot.
- Interactive schedule (with the selected date/month rendered as headers) plus an inline booking form.
- Booking form lets the user pick room, day, time and duration of the meeting.
- Any user can delete a booked room, upon doing so a toaster is displayed for five seconds with the possibility to regret the deletion by pressing a button.
- Filter by room(s) to display all booked slots for the chosen room(s).

## Future improvements

- Implement routing for better user experience as now you need to reload the page to return home.
- Add buttons to move backwards, with or without routing.
- Add possibility to save the information either in your calendar or get it by email.
- Possibility to click the booking card in mobile to display the full information.

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
