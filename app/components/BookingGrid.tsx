import React from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { BookingCard } from './BookingCard';
import type { Booking } from '@/lib/types';

interface BookingGridProps {
  displayedDates: Date[];
  bookings: Record<string, Booking[]>;
  filteredRooms: Set<string>;
  onDeleteBooking: (bookingId: number) => void;
  deletingBookingId: number | null;
  loading: boolean;
}

export function BookingGrid({
  displayedDates,
  bookings,
  filteredRooms,
  onDeleteBooking,
  deletingBookingId,
  loading,
}: BookingGridProps) {
  return (
    <div
      className="overflow-x-auto rounded-lg bg-white ring-1 ring-neutral-500"
      role="region"
      aria-describedby="calendar-heading"
    >
      <h2 id="calendar-heading" className="sr-only">
        Schema för bokningar
      </h2>
      {/* Header */}
      <div
        className="grid border-b border-neutral-500"
        style={{
          gridTemplateColumns: `repeat(${displayedDates.length}, minmax(120px, 1fr))`,
        }}
      >
        {displayedDates.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd', { locale: sv }).toLowerCase().replace('.', '');
          return (
            <div
              key={dateStr}
              className="text-center font-semibold border-r border-neutral-500 px-2 py-2 last:border-r-0"
            >
              <p className="text-base font-semibold text-slate-900">
                {format(date, 'EEE dd MMM', { locale: sv }).toLowerCase().replace('.', '')}
              </p>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${displayedDates.length}, minmax(120px, 1fr))`,
        }}
      >
        {displayedDates.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const dateLabel = format(date, 'dd MMMM yyyy', { locale: sv });
          const dateBookings = (bookings[dateStr] || [])
            .filter((booking) => filteredRooms.has(booking.roomId))
            .sort((a, b) => a.startHour - b.startHour);

          return (
            <div
              key={dateStr}
              role="group"
              aria-labelledby={`date-${dateStr}`}
              className="border-r border-neutral-500 last:border-r-0"
            >
              <h3 id={`date-${dateStr}`} className="sr-only">
                Bokningar för {dateLabel}
              </h3>
              <ul
                aria-label={`Bokningar för ${dateLabel}`}
                className="space-y-2 list-none flex flex-col"
              >
                {dateBookings.length === 0 && (
                  <li className="text-sm text-slate-600 italic text-center py-6">Inga bokningar</li>
                )}

                {dateBookings.map((booking) => (
                  <li key={booking.id} className="m-1.5 mb-0 last:mb-1.5">
                    <BookingCard
                      booking={booking}
                      onDelete={onDeleteBooking}
                      isDeleting={deletingBookingId === booking.id}
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="p-3 text-center text-sm text-slate-700" role="status" aria-live="polite">
          Laddar bokningar…
        </p>
      )}
    </div>
  );
}
