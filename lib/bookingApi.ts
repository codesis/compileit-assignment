import { format } from 'date-fns';

export async function fetchBookings(displayedDates: Date[]) {
  const dateStrings = displayedDates.map((d) => format(d, 'yyyy-MM-dd'));
  const response = await fetch(`/api/bookings?dates=${dateStrings.join(',')}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Unable to fetch bookings');
  }

  return payload.bookings ?? {};
}

export async function createBookingRequest(
  roomId: string,
  date: string,
  startHour: number,
  organizerName: string,
) {
  return fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomId,
      date,
      startHour,
      title: 'Meeting',
      organizer: organizerName,
    }),
  });
}
