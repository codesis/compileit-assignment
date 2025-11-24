import { addDays, format, isWeekend, isToday } from 'date-fns';

export const WEEKDAY_START_HOUR = 8;
export const WEEKDAY_END_HOUR = 17;

export const TIME_SLOTS = Array.from(
  {
    length: WEEKDAY_END_HOUR - WEEKDAY_START_HOUR,
  },
  (_, index) => WEEKDAY_START_HOUR + index,
);

export function formatSlot(hour: number) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return format(date, 'HH:mm');
}

export function getNextBookableDate(base = new Date()) {
  const tentative = new Date(base);
  if (!isWeekend(tentative)) {
    return tentative;
  }

  let cursor = tentative;
  while (isWeekend(cursor)) {
    cursor = addDays(cursor, 1);
  }
  return cursor;
}

export function isBookableDate(date: Date) {
  return !isWeekend(date);
}

export function getWeekdayRange(startDate: Date, count: number): Date[] {
  const dates: Date[] = [];
  let current = new Date(startDate);
  let added = 0;

  while (added < count) {
    if (!isWeekend(current)) {
      dates.push(new Date(current));
      added++;
    }
    current = addDays(current, 1);
  }

  return dates;
}

export function getAvailableTimeSlots(date: Date): number[] {
  const now = new Date();
  const isCurrentDay = isToday(date);

  if (!isCurrentDay) {
    return TIME_SLOTS;
  }

  const currentHour = now.getHours();
  return TIME_SLOTS.filter((hour) => hour >= currentHour);
}

export function isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}
