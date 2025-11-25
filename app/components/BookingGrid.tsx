import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ROOMS } from '@/lib/rooms';
import { formatSlot, getAvailableTimeSlots } from '@/lib/time';
import type { Booking } from '@/lib/types';

interface BookingGridProps {
  displayedDates: Date[];
  bookingMap: Record<string, Booking>;
  selectedSlots: Set<string>;
  filteredRooms: Set<string>;
  onToggleSlot: (roomId: string, date: string, hour: number) => void;
  loading: boolean;
}

export function BookingGrid({
  displayedDates,
  bookingMap,
  selectedSlots,
  filteredRooms,
  onToggleSlot,
  loading,
}: BookingGridProps) {
  const allTimeSlots = useMemo(() => {
    const slotsSet = new Set<number>();
    displayedDates.forEach((date) => {
      getAvailableTimeSlots(date).forEach((slot) => slotsSet.add(slot));
    });
    return Array.from(slotsSet).sort((a, b) => a - b);
  }, [displayedDates]);

  const visibleRooms = useMemo(() => {
    if (filteredRooms.size === 0) return [];
    return ROOMS.filter((room) => filteredRooms.has(room.id));
  }, [filteredRooms]);

  return (
    <div
      className="overflow-x-auto rounded-lg bg-white ring-1 ring-neutral-500"
      aria-label="Kalender"
      aria-description="Schema för bokbara möten"
    >
      {/* Header */}
      <div
        className="grid border-b border-neutral-500"
        style={{
          gridTemplateColumns: `repeat(${displayedDates.length}, minmax(80px, 1fr))`,
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
                {format(date, 'dd MMM', { locale: sv }).toLowerCase().replace('.', '')}
              </p>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${displayedDates.length}, minmax(80px, 1fr))`,
        }}
      >
        {displayedDates.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');

          const roomsForDay = allTimeSlots.flatMap((hour) => {
            const availableSlots = getAvailableTimeSlots(date);
            const isAvailable = availableSlots.includes(hour);

            if (!isAvailable) return [];

            return visibleRooms
              .filter((room) => {
                const key = `${dateStr}-${room.id}-${hour}`;
                return !bookingMap[key];
              })
              .map((room) => ({
                ...room,
                hour,
              }));
          });

          return (
            <ul
              key={dateStr}
              aria-label={`Tillgängliga mötesrum för ${format(date, 'dd MMMM yyyy', { locale: sv })}`}
              className="space-y-2 list-none border-r border-neutral-500 last:border-r-0 flex flex-col"
            >
              {roomsForDay.length === 0 && (
                <li className="text-sm text-slate-600 italic text-center py-6">
                  Inga mötesrum tillgängliga
                </li>
              )}

              {roomsForDay.map((room) => {
                const key = `${dateStr}-${room.id}-${room.hour}`;
                const isSelected = selectedSlots.has(key);
                const timeSlotLabel = `${formatSlot(room.hour)}-${formatSlot(room.hour + 1)}`;

                return (
                  <li key={key} className="m-1.5 mb-0 last:mb-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleSlot(room.id, dateStr, room.hour)}
                      className={`rounded-md border px-2 py-1 w-full transition text-left flex flex-col
                        ${
                          isSelected
                            ? 'border-emerald-900 bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'
                            : 'border-emerald-600 hover:border-emerald-900 hover:outline focus-visible:outline focus-visible:outline-black'
                        }
                      `}
                    >
                      <span
                        aria-hidden="true"
                        className={`text-sm font-normal
                          ${isSelected ? 'text-white' : 'text-slate-900'}
                          `}
                      >
                        {room.name + ' (' + room.capacity + ')'}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`text-xs
                          ${isSelected ? 'text-white' : 'text-slate-900'}
                        `}
                      >
                        {timeSlotLabel}
                      </span>
                      <span className="sr-only">
                        {room.name + ' ' + room.capacity + ' personer, kl ' + timeSlotLabel}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>

      {loading && <p className="p-3 text-center text-sm text-slate-700">Laddar mötesrum…</p>}
    </div>
  );
}
