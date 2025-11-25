import React, { useCallback, useEffect, useMemo } from 'react';
import { useBookingState } from './useBookingState';
import { fetchBookings, createBookingRequest } from '@/lib/bookingApi';
import { BookingHeader } from './BookingHeader';
import { RoomFilter } from './RoomFilter';
import { BookingGrid } from './BookingGrid';
import { BookingForm } from './BookingForm';
import type { Booking } from '@/lib/types';
import { BookingNav } from './BookingNav';

export function BookPage({ onClose }: { onClose: () => void }) {
  const state = useBookingState();

  const bookingMap = useMemo(() => {
    const map: Record<string, Booking> = {};
    Object.entries(state.bookings).forEach(([date, dateBookings]) => {
      dateBookings.forEach((booking) => {
        const key = `${date}-${booking.roomId}-${booking.startHour}`;
        map[key] = booking;
      });
    });
    return map;
  }, [state.bookings]);

  const loadBookings = useCallback(async () => {
    if (state.displayedDates.length === 0) return;
    state.setLoading(true);
    state.setError(null);

    try {
      const bookings = await fetchBookings(state.displayedDates);
      state.setBookings(bookings);
    } catch (err) {
      state.setError(err instanceof Error ? err.message : 'Oväntat fel vid hämtning av bokningar');
    } finally {
      state.setLoading(false);
    }
  }, [state.displayedDates]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const toggleSlot = (roomId: string, date: string, hour: number) => {
    const key = `${date}-${roomId}-${hour}`;
    const booking = bookingMap[key];
    if (booking) return;

    state.setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      if (next.size > 0 && state.error) {
        state.setError(null);
      }
      return next;
    });
  };

  const handleNext = () => {
    if (state.selectedSlots.size === 0) {
      state.setError('Du behöver välja minst en tid innan du går vidare.');
      return;
    }
    state.setError(null);
    state.setView('form');
  };

  const handleBook = async () => {
    if (state.selectedSlots.size === 0) {
      state.setError('Du behöver välja minst en tid innan du går vidare.');
      return;
    }

    if (!state.organizerName.trim()) {
      state.setError('Ange ditt namn för att slutföra bokningen.');
      return;
    }

    state.setStatus('saving');
    state.setError(null);

    try {
      const slots = Array.from(state.selectedSlots).map((key) => {
        const date = key.substring(0, 10);
        const remaining = key.substring(11);
        const lastDashIndex = remaining.lastIndexOf('-');
        const roomId = remaining.substring(0, lastDashIndex);
        const hour = parseInt(remaining.substring(lastDashIndex + 1), 10);
        return { date, roomId, hour };
      });

      const promises = slots.map((slot) =>
        createBookingRequest(slot.roomId, slot.date, slot.hour, state.organizerName),
      );

      const results = await Promise.all(promises);
      const errors = results.filter((r) => !r.ok);

      if (errors.length > 0) {
        throw new Error('Några bokningar kunde inte genomföras. Försök igen.');
      }

      const count = state.selectedSlots.size;
      state.setSelectedSlots(new Set());
      state.setOrganizerName('');
      await loadBookings();
      state.setConfirmedBookingsCount(count);
      state.setShowModal(true);
    } catch (err) {
      state.setError(err instanceof Error ? err.message : 'Oväntat fel');
    } finally {
      state.setStatus('idle');
    }
  };

  const handleOrganizerNameChange = (name: string) => {
    state.setOrganizerName(name);
    if (name.trim() && state.error) {
      state.setError(null);
    }
  };

  const closeModal = () => {
    state.setShowModal(false);
    onClose();
  };

  if (state.view === 'form') {
    return (
      <BookingForm
        organizerName={state.organizerName}
        onOrganizerNameChange={handleOrganizerNameChange}
        onBook={handleBook}
        status={state.status}
        error={state.error}
        showModal={state.showModal}
        confirmedBookingsCount={state.confirmedBookingsCount}
        onCloseModal={closeModal}
      />
    );
  }

  return (
    <section className="flex-1 flex flex-col space-y-10">
      <BookingHeader title="Välj en tid" />

      <RoomFilter
        filteredRooms={state.filteredRooms}
        filterDropdownOpen={state.filterDropdownOpen}
        onToggleDropdown={() => state.setFilterDropdownOpen(!state.filterDropdownOpen)}
        onApplyFilter={state.applyRoomFilter}
      />

      <BookingNav
        canNavigatePrev={state.canNavigatePrev}
        onNavigatePrev={() => state.navigateDates('prev')}
        onNavigateNext={() => state.navigateDates('next')}
        displayedDates={state.displayedDates}
      />

      <BookingGrid
        displayedDates={state.displayedDates}
        bookingMap={bookingMap}
        selectedSlots={state.selectedSlots}
        filteredRooms={state.filteredRooms}
        onToggleSlot={toggleSlot}
        loading={state.loading}
      />

      <div className="flex flex-col items-center justify-between mb-0 mt-auto">
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-600 mb-3" aria-live="polite">
            {state.error}
          </p>
        </div>
        <button
          type="button"
          onClick={handleNext}
          className="
            rounded-2xl 
            bg-black 
            px-6 
            py-3 
            text-base 
            font-normal 
            text-white 
            shadow-sm 
            hover:bg-brand-700 
            w-full 
            focus-visible:outline-2 
            focus-visible:outline-offset-2 
            focus-visible:outline-black
            "
        >
          Nästa
        </button>
      </div>
    </section>
  );
}
