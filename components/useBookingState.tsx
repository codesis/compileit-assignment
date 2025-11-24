import { useState, useEffect, useCallback, useMemo } from 'react';
import { addDays } from 'date-fns';
import { ROOMS } from '@/lib/rooms';
import { getNextBookableDate, getWeekdayRange, isDateInPast } from '@/lib/time';
import type { Booking } from '@/lib/types';
import { DAYS_TO_SHOW_MOBILE, DAYS_TO_SHOW_DESKTOP } from '@/lib/constants';

export function useBookingState() {
  const [startDate, setStartDate] = useState(() => getNextBookableDate());
  const [bookings, setBookings] = useState<Record<string, Booking[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [filteredRooms, setFilteredRooms] = useState<Set<string>>(new Set(ROOMS.map((r) => r.id)));
  const [view, setView] = useState<'table' | 'form'>('table');
  const [organizerName, setOrganizerName] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');
  const [showModal, setShowModal] = useState(false);
  const [confirmedBookingsCount, setConfirmedBookingsCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

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

  useEffect(() => {
    const stored = localStorage.getItem('bookings');
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(bookings).length > 0) {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

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

  return {
    startDate,
    bookings,
    setBookings,
    loading,
    setLoading,
    error,
    setError,
    selectedSlots,
    setSelectedSlots,
    filteredRooms,
    view,
    setView,
    organizerName,
    setOrganizerName,
    status,
    setStatus,
    showModal,
    setShowModal,
    confirmedBookingsCount,
    setConfirmedBookingsCount,
    isMobile,
    filterDropdownOpen,
    setFilterDropdownOpen,
    daysToShow,
    displayedDates,
    canNavigatePrev,
    navigateDates,
    applyRoomFilter,
  };
}
