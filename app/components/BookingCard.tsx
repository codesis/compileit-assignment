import React from 'react';
import { ROOMS } from '@/lib/rooms';
import { formatTimeRange } from '@/lib/bookingUtils';
import type { Booking } from '@/lib/types';

interface BookingCardProps {
  booking: Booking;
  onDelete: (bookingId: number) => void;
  isDeleting: boolean;
}

export function BookingCard({ booking, onDelete, isDeleting }: BookingCardProps) {
  const room = ROOMS.find((r) => r.id === booking.roomId);

  return (
    <div
      className="
      rounded-md
      border
      px-2
      py-1
      w-full
      text-left
      flex
      flex-col
      border-slate-300
      bg-slate-50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-normal text-slate-900 block">
            {room?.name || 'Okänt rum'} ({room?.capacity || '?'})
          </span>
          <span className="text-xs text-slate-900 block">
            {formatTimeRange(booking.startHour, booking.endHour)}
          </span>
          <span className="text-xs text-slate-600 block truncate">{booking.organizer}</span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(booking.id)}
          disabled={isDeleting}
          className="
            text-red-600 
            hover:text-red-800 
            text-xs 
            font-medium 
            disabled:opacity-50 
            disabled:cursor-not-allowed 
            shrink-0 
            focus-visible:outline 
            focus-visible:outline-black"
          aria-label={`Ta bort bokning: ${room?.name || 'Okänt rum'}, ${formatTimeRange(booking.startHour, booking.endHour)}`}
        >
          <span className="sm:hidden">✕</span>

          <span className="hidden sm:inline">{isDeleting ? 'Tar bort...' : 'Ta bort'}</span>
        </button>
      </div>
    </div>
  );
}
