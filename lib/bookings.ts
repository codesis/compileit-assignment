import { db } from './db';
import { WEEKDAY_END_HOUR, WEEKDAY_START_HOUR } from './time';

export type Booking = {
  id: number;
  roomId: string;
  date: string; // ISO date (yyyy-MM-dd)
  startHour: number;
  endHour: number;
  title: string;
  organizer: string;
  createdAt: string;
};

const selectByDate = db.prepare(
  `SELECT id, roomId, date, startHour, endHour, title, organizer, createdAt
   FROM bookings
   WHERE date = ?
   ORDER BY startHour ASC`,
);

const conflictQuery = db.prepare(
  `SELECT id FROM bookings WHERE roomId = ? AND date = ? AND startHour = ? LIMIT 1`,
);

const insertBooking = db.prepare(
  `INSERT INTO bookings (roomId, date, startHour, endHour, title, organizer)
   VALUES (@roomId, @date, @startHour, @endHour, @title, @organizer)`,
);

export function getBookingsForDate(date: string): Booking[] {
  return selectByDate.all(date) as Booking[];
}

type CreateBookingInput = {
  roomId: string;
  date: string;
  startHour: number;
  title: string;
  organizer: string;
};

export function createBooking(payload: CreateBookingInput) {
  if (payload.startHour < WEEKDAY_START_HOUR || payload.startHour >= WEEKDAY_END_HOUR) {
    throw new Error('Invalid start hour');
  }

  const conflict = conflictQuery.get(payload.roomId, payload.date, payload.startHour);
  if (conflict) {
    throw new Error('Slot already booked');
  }

  const info = insertBooking.run({
    ...payload,
    endHour: payload.startHour + 1,
  });

  return {
    id: Number(info.lastInsertRowid),
    ...payload,
    endHour: payload.startHour + 1,
    createdAt: new Date().toISOString(),
  } satisfies Booking;
}
