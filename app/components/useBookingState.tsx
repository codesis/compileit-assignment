import { useState, useEffect, useCallback, useMemo } from 'react';
import { addDays } from 'date-fns';
import { ROOMS } from '@/lib/rooms';
import { getNextBookableDate, getWeekdayRange, isDateInPast } from '@/lib/time';
import { fetchBookings, createBookingRequest, deleteBooking } from '@/lib/bookingApi';
import type { Booking } from '@/lib/types';
import { DAYS_TO_SHOW_MOBILE, DAYS_TO_SHOW_DESKTOP } from '@/lib/constants';

export function useBookingState() {
  const [startDate, setStartDate] = useState(() => getNextBookableDate());
  const [bookings, setBookings] = useState<Record<string, Booking[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredRooms, setFilteredRooms] = useState<Set<string>>(new Set(ROOMS.map((r) => r.id)));
  const [view, setView] = useState<'calendar' | 'form'>('calendar');
  const [status, setStatus] = useState<'idle' | 'saving' | 'deleting'>('idle');
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState<number | null>(null);
  const [deletedBooking, setDeletedBooking] = useState<Booking | null>(null);
  const [showToaster, setShowToaster] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-filter-dropdown]')) {
        setFilterDropdownOpen(false);
      }
    };

    if (filterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [filterDropdownOpen]);

  const daysToShow = isMobile ? DAYS_TO_SHOW_MOBILE : DAYS_TO_SHOW_DESKTOP;

  const displayedDates = useMemo(() => {
    return getWeekdayRange(startDate, daysToShow);
  }, [startDate, daysToShow]);

  const canNavigatePrev = useMemo(() => {
    const step = -daysToShow;
    const newStart = addDays(startDate, step);
    const candidate = getNextBookableDate(newStart);
    return !isDateInPast(candidate);
  }, [startDate, daysToShow]);

  const loadBookings = useCallback(async () => {
    if (displayedDates.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const bookingsData = await fetchBookings(displayedDates);
      setBookings(bookingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Oväntat fel vid hämtning av bokningar');
    } finally {
      setLoading(false);
    }
  }, [displayedDates]);

  const navigateDates = useCallback(
    (direction: 'prev' | 'next') => {
      const step = direction === 'next' ? daysToShow : -daysToShow;
      const newStart = addDays(startDate, step);

      if (direction === 'prev') {
        const candidate = getNextBookableDate(newStart);
        if (isDateInPast(candidate)) {
          return;
        }
      }

      setStartDate(newStart);
    },
    [startDate, daysToShow],
  );

  const applyRoomFilter = useCallback((rooms: Set<string>) => {
    setFilteredRooms(rooms);
  }, []);

  const handleDeleteBooking = useCallback(
    async (bookingId: number) => {
      setDeletingBookingId(bookingId);
      setError(null);

      let deletedBookingData: Booking | null = null;
      Object.values(bookings).forEach((dateBookings) => {
        const found = dateBookings.find((b) => b.id === bookingId);
        if (found) deletedBookingData = found;
      });

      try {
        const response = await deleteBooking(bookingId);

        if (!response.ok) {
          throw new Error('Kunde inte ta bort bokningen');
        }

        setDeletedBooking(deletedBookingData);

        setBookings((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((date) => {
            updated[date] = updated[date].filter((b) => b.id !== bookingId);
            if (updated[date].length === 0) {
              delete updated[date];
            }
          });
          return updated;
        });

        setShowToaster(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Oväntat fel vid borttagning');
      } finally {
        setDeletingBookingId(null);
      }
    },
    [bookings],
  );

  const handleUndoDelete = useCallback(async () => {
    if (!deletedBooking) return;

    const booking = deletedBooking;

    try {
      const response = await createBookingRequest(
        booking.roomId,
        booking.date,
        booking.startHour,
        booking.endHour,
        booking.organizer,
      );

      if (!response.ok) {
        throw new Error('Kunde inte återställa bokningen');
      }

      const result = await response.json();

      setBookings((prev) => {
        const updated = { ...prev };
        const date = booking.date;

        if (!updated[date]) {
          updated[date] = [];
        }

        updated[date] = [...updated[date], result.booking].sort(
          (a, b) => a.startHour - b.startHour,
        );

        return updated;
      });

      setShowToaster(false);
      setDeletedBooking(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte återställa bokningen');
      setShowToaster(false);
      setDeletedBooking(null);
    }
  }, [deletedBooking]);

  const handleCreateBooking = useCallback(
    async (roomId: string, date: string, startHour: number, endHour: number, organizer: string) => {
      setStatus('saving');
      setError(null);

      try {
        const response = await createBookingRequest(roomId, date, startHour, endHour, organizer);

        if (!response.ok) {
          throw new Error('Kunde inte skapa bokningen');
        }

        const result = await response.json();

        setBookings((prev) => {
          const updated = { ...prev };
          if (!updated[date]) {
            updated[date] = [];
          }
          updated[date] = [...updated[date], result.booking];
          return updated;
        });

        setShowModal(true);

        setTimeout(() => {
          setShowModal(false);
          setView('calendar');
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Oväntat fel vid bokning');
      } finally {
        setStatus('idle');
      }
    },
    [],
  );

  const closeToaster = useCallback(() => {
    setShowToaster(false);
    setDeletedBooking(null);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setView('calendar');
  }, []);

  return {
    // State
    startDate,
    bookings,
    loading,
    error,
    filteredRooms,
    view,
    status,
    showModal,
    isMobile,
    filterDropdownOpen,
    daysToShow,
    displayedDates,
    canNavigatePrev,
    deletingBookingId,
    deletedBooking,
    showToaster,

    // State setters
    setView,
    setFilterDropdownOpen,

    // Actions
    loadBookings,
    navigateDates,
    applyRoomFilter,
    handleDeleteBooking,
    handleUndoDelete,
    handleCreateBooking,
    closeToaster,
    closeModal,
  };
}
