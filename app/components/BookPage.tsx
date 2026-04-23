import React, { useEffect } from 'react';
import { useBookingState } from './useBookingState';
import { BookingHeader } from './BookingHeader';
import { RoomFilter } from './RoomFilter';
import { BookingGrid } from './BookingGrid';
import { BookingForm } from './BookingForm';
import { BookingNav } from './BookingNav';
import { Toaster } from './Toaster';

export function BookPage({ onClose }: { onClose: () => void }) {
  const state = useBookingState();

  useEffect(() => {
    state.loadBookings();
  }, [state.loadBookings]);

  if (state.view === 'form') {
    return (
      <BookingForm
        displayedDates={state.displayedDates}
        bookings={state.bookings}
        onBack={() => state.setView('calendar')}
        onBook={state.handleCreateBooking}
        status={state.status}
        error={state.error}
        showModal={state.showModal}
        onCloseModal={state.closeModal}
      />
    );
  }

  return (
    <section className="flex-1 flex flex-col space-y-10">
      <BookingHeader title="Bokningar" />

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
        bookings={state.bookings}
        filteredRooms={state.filteredRooms}
        onDeleteBooking={state.handleDeleteBooking}
        deletingBookingId={state.deletingBookingId}
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
          onClick={() => state.setView('form')}
          className="
            rounded-2xl 
            bg-black 
            px-6 
            py-3 
            text-base 
            font-normal 
            text-white 
            shadow-sm 
            hover:bg-gray-800 
            w-full 
            focus-visible:outline-2 
            focus-visible:outline-offset-2 
            focus-visible:outline-black
            "
        >
          Ny bokning
        </button>
      </div>

      {state.showToaster && state.deletedBooking && (
        <Toaster
          message="Bokningen har tagits bort"
          onUndo={state.handleUndoDelete}
          onClose={() => {
            state.closeToaster();
          }}
          duration={5000}
        />
      )}
    </section>
  );
}
