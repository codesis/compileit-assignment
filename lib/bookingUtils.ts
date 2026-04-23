import type { Booking } from '@/lib/types';

export function hasBookingConflict(
  roomId: string,
  date: string,
  startHour: number,
  endHour: number,
  bookings: Record<string, Booking[]>,
  excludeBookingId?: number,
): boolean {
  const dateBookings = bookings[date] || [];

  return dateBookings.some((booking) => {
    if (excludeBookingId && booking.id === excludeBookingId) {
      return false;
    }

    if (booking.roomId !== roomId) {
      return false;
    }

    return startHour < booking.endHour && endHour > booking.startHour;
  });
}

export function calculateEndHour(startHour: number, durationMinutes: number): number {
  return startHour + durationMinutes / 60;
}

export function getBookingsForRoomAndDate(
  roomId: string,
  date: string,
  bookings: Record<string, Booking[]>,
): Booking[] {
  const dateBookings = bookings[date] || [];
  return dateBookings.filter((b) => b.roomId === roomId);
}

export function formatTimeRange(startHour: number, endHour: number): string {
  const formatHour = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}
