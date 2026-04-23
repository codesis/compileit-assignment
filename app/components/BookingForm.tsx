import React, { useEffect, useRef, useState } from 'react';
import { format, addDays, getDay, isToday, isTomorrow } from 'date-fns';
import { sv } from 'date-fns/locale';
import { BookingHeader } from './BookingHeader';
import { ROOMS } from '@/lib/rooms';
import { getAvailableTimeSlots } from '@/lib/time';
import { hasBookingConflict, calculateEndHour } from '@/lib/bookingUtils';
import { DURATION_OPTIONS, type Booking } from '@/lib/types';

interface BookingFormProps {
  displayedDates: Date[];
  bookings: Record<string, Booking[]>;
  onBack: () => void;
  onBook: (
    roomId: string,
    date: string,
    startHour: number,
    endHour: number,
    organizer: string,
  ) => void;
  status: 'idle' | 'saving' | 'deleting';
  error: string | null;
  showModal: boolean;
  onCloseModal: () => void;
}

export function BookingForm({
  bookings,
  onBack,
  onBook,
  status,
  error,
  showModal,
  onCloseModal,
}: BookingFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [organizerName, setOrganizerName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (showModal) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    const handleClose = () => {
      onCloseModal();
    };

    dialog.addEventListener('close', handleClose);
    return () => {
      dialog.removeEventListener('close', handleClose);
    };
  }, [showModal, onCloseModal]);

  const availableTimeSlots = selectedDate ? getAvailableTimeSlots(new Date(selectedDate)) : [];

  useEffect(() => {
    if (status === 'saving') {
      return;
    }

    if (selectedRoom && selectedDate && selectedTime !== null) {
      const endHour = calculateEndHour(selectedTime, selectedDuration);
      const conflict = hasBookingConflict(
        selectedRoom,
        selectedDate,
        selectedTime,
        endHour,
        bookings,
      );

      if (conflict) {
        setValidationError('Detta rum är redan bokat under den valda tiden.');
      } else {
        setValidationError(null);
      }
    }
  }, [selectedRoom, selectedDate, selectedTime, selectedDuration, bookings, status]);

  const handleSubmit = () => {
    if (!selectedRoom) {
      setValidationError('Välj ett rum.');
      return;
    }
    if (!selectedDate) {
      setValidationError('Välj ett datum.');
      return;
    }
    if (selectedTime === null) {
      setValidationError('Välj en starttid.');
      return;
    }
    if (!organizerName.trim()) {
      setValidationError('Ange ditt namn.');
      return;
    }

    const endHour = calculateEndHour(selectedTime, selectedDuration);

    if (endHour > 17) {
      const maxDuration = (17 - selectedTime) * 60;
      const hours = Math.floor(maxDuration / 60);
      const minutes = maxDuration % 60;
      const timeStr = minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
      setValidationError(
        `Bokningen kan inte sträcka sig förbi 17:00. Max längd från ${selectedTime.toString().padStart(2, '0')}:00 är ${timeStr}.`,
      );
      return;
    }

    const conflict = hasBookingConflict(
      selectedRoom,
      selectedDate,
      selectedTime,
      endHour,
      bookings,
    );

    if (conflict) {
      setValidationError('Detta rum är redan bokat under den valda tiden.');
      return;
    }

    setValidationError(null);
    onBook(selectedRoom, selectedDate, selectedTime, endHour, organizerName);

    setSelectedRoom('');
    setSelectedDate('');
    setSelectedTime(null);
    setSelectedDuration(60);
    setOrganizerName('');
  };

  const getNextTwoWeeks = () => {
    const dates: Date[] = [];
    let current = new Date();

    while (dates.length < 14) {
      const day = getDay(current);

      if (day !== 0 && day !== 6) {
        dates.push(current);
      }

      current = addDays(current, 1);
    }

    return dates;
  };

  return (
    <section className="flex-1 flex flex-col space-y-10">
      <BookingHeader title="Ny bokning" />

      <div className="rounded-lg">
        <div className="space-y-4">
          <div>
            <label className="text-base font-medium text-black">
              Rum
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                name="room"
                className="
                  mt-2 
                  w-full 
                  rounded-xl 
                  border 
                  border-neutral-500 
                  px-3 
                  py-3 
                  text-base 
                  font-normal 
                  focus-visible:outline 
                  focus-visible:outline-black
                "
              >
                <option value="">Välj rum</option>
                {ROOMS.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.capacity} personer)
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="text-base font-medium text-black">
              Datum
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                name="date"
                className="
                  mt-2 
                  w-full 
                  rounded-xl 
                  border 
                  border-neutral-500 
                  px-3 
                  py-3 
                  text-base 
                  font-normal 
                  focus-visible:outline 
                  focus-visible:outline-black
                "
              >
                <option value="">Välj datum</option>
                {getNextTwoWeeks().map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');

                  let label = format(date, 'EEE d MMMM', { locale: sv });

                  if (isToday(date)) {
                    label = `Idag (${label})`;
                  } else if (isTomorrow(date)) {
                    label = `Imorgon (${label})`;
                  }

                  return (
                    <option key={dateStr} value={dateStr}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <div>
            <label className="text-base font-medium text-black">
              Starttid
              <select
                value={selectedTime ?? ''}
                onChange={(e) => setSelectedTime(e.target.value ? Number(e.target.value) : null)}
                disabled={!selectedDate}
                name="startTime"
                className="
                  mt-2 
                  w-full 
                  rounded-xl 
                  border 
                  border-neutral-500 
                  px-3 
                  py-3 
                  text-base 
                  font-normal 
                  focus-visible:outline 
                  focus-visible:outline-black
                  disabled:opacity-50
                "
              >
                <option value="">Välj tid</option>
                {availableTimeSlots.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="text-base font-medium text-black">
              Längd
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                name="duration"
                className="
                  mt-2 
                  w-full 
                  rounded-xl 
                  border 
                  border-neutral-500 
                  px-3 
                  py-3 
                  text-base 
                  font-normal 
                  focus-visible:outline 
                  focus-visible:outline-black
                "
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="text-base font-medium text-black">
              Ditt namn
              <input
                type="text"
                name="organizerName"
                autoComplete="name"
                required
                className="
                  mt-2 
                  w-full 
                  rounded-xl 
                  border 
                  border-neutral-500 
                  px-3 
                  py-3 
                  text-base 
                  font-normal 
                  focus-visible:outline 
                  focus-visible:outline-black
                "
                value={organizerName}
                onChange={(e) => {
                  setOrganizerName(e.target.value);
                  if (e.target.value.trim() && validationError === 'Ange ditt namn.') {
                    setValidationError(null);
                  }
                }}
                placeholder="Förnamn och efternamn"
                aria-describedby={validationError || error ? 'error-message' : undefined}
                aria-invalid={validationError || error ? 'true' : 'false'}
              />
            </label>
          </div>

          {(validationError || error) && (
            <p className="text-sm text-red-600" id="error-message" role="alert">
              {validationError || error}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-auto mb-0">
        <button
          type="button"
          onClick={onBack}
          className="
            flex-1
            rounded-2xl 
            border 
            border-neutral-500 
            bg-white 
            px-6 
            py-3 
            text-base 
            font-normal 
            text-black 
            hover:bg-slate-50
            focus-visible:outline-2 
            focus-visible:outline-offset-2 
            focus-visible:outline-black
          "
        >
          Tillbaka
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === 'saving' || !!validationError}
          aria-live="polite"
          className="
            flex-1
            rounded-2xl 
            bg-black 
            px-6 
            py-3 
            text-base 
            font-normal 
            text-white 
            shadow-sm 
            hover:bg-gray-800 
            disabled:opacity-50 
            disabled:cursor-not-allowed
            focus-visible:outline-2 
            focus-visible:outline-offset-2 
            focus-visible:outline-black
          "
        >
          {status === 'saving' ? 'Bokar...' : 'Boka'}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="success-message"
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            onCloseModal();
          }
        }}
        className="
          m-auto 
          backdrop:bg-black/40 
          bg-white 
          rounded-2xl 
          p-8 
          max-w-72 
          w-full 
          shadow-xl
        "
      >
        <p
          id="success-message"
          className="text-base text-black text-center flex flex-col items-center gap-2"
        >
          Rummet är bokat!
          <span className="text-2xl" aria-hidden="true">
            ☺
          </span>
        </p>
      </dialog>
    </section>
  );
}
