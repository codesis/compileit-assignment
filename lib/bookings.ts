import { db } from './db';
import { WEEKDAY_END_HOUR, WEEKDAY_START_HOUR } from './time';

export type Booking = {
  id: number;
  roomId: string;
  date: string;
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
  `SELECT id FROM bookings 
   WHERE roomId = ? 
   AND date = ? 
   AND (
     (startHour < ? AND endHour > ?)
     OR (startHour < ? AND endHour > ?)
     OR (startHour >= ? AND endHour <= ?)
   )
   LIMIT 1`,
);

const insertBooking = db.prepare(
  `INSERT INTO bookings (roomId, date, startHour, endHour, title, organizer)
   VALUES (@roomId, @date, @startHour, @endHour, @title, @organizer)`,
);

const deleteBooking = db.prepare(`DELETE FROM bookings WHERE id = ?`);

export function getBookingsForDate(date: string): Booking[] {
  return selectByDate.all(date) as Booking[];
}

type CreateBookingInput = {
  roomId: string;
  date: string;
  startHour: number;
  endHour: number;
  title: string;
  organizer: string;
};

export function createBooking(payload: CreateBookingInput) {
  if (payload.startHour < WEEKDAY_START_HOUR || payload.startHour >= WEEKDAY_END_HOUR) {
    throw new Error('Invalid start hour');
  }

  if (payload.endHour <= payload.startHour || payload.endHour > WEEKDAY_END_HOUR) {
    throw new Error('Invalid end hour');
  }

  const conflict = conflictQuery.get(
    payload.roomId,
    payload.date,
    payload.endHour,
    payload.startHour,
    payload.endHour,
    payload.startHour,
    payload.startHour,
    payload.endHour,
  );

  if (conflict) {
    throw new Error('Slot already booked');
  }

  const info = insertBooking.run(payload);

  return {
    id: Number(info.lastInsertRowid),
    ...payload,
    createdAt: new Date().toISOString(),
  } satisfies Booking;
}

export function removeBooking(id: number) {
  const info = deleteBooking.run(id);
  return info.changes > 0;
}
