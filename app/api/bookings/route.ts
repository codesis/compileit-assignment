import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parseISO, isValid } from 'date-fns';
import { createBooking, getBookingsForDate } from '@/lib/bookings';
import { isBookableDate, WEEKDAY_END_HOUR, WEEKDAY_START_HOUR } from '@/lib/time';

const bookingSchema = z.object({
  roomId: z.string().min(1),
  date: z
    .string()
    .min(1)
    .refine((value) => {
      const parsed = parseISO(value);
      return isValid(parsed) && isBookableDate(parsed);
    }, 'Only weekdays between 08:00 and 17:00 are allowed'),
  startHour: z
    .number()
    .int()
    .min(WEEKDAY_START_HOUR)
    .max(WEEKDAY_END_HOUR - 1),
  title: z.string().min(1).max(80),
  organizer: z.string().min(1).max(80),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dates = searchParams.get('dates');

  if (!dates) {
    return NextResponse.json({ message: 'dates parameter is required' }, { status: 400 });
  }

  const dateList = dates.split(',').filter(Boolean);
  const allBookings: Record<string, ReturnType<typeof getBookingsForDate>> = {};

  for (const dateStr of dateList) {
    const parsed = parseISO(dateStr);
    if (isValid(parsed) && isBookableDate(parsed)) {
      allBookings[dateStr] = getBookingsForDate(dateStr);
    }
  }

  return NextResponse.json({
    bookings: allBookings,
  });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const result = bookingSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      {
        errors: result.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const booking = createBooking(result.data);
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save booking';
    return NextResponse.json({ message }, { status: 409 });
  }
}
