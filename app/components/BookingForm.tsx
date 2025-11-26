import React, { useEffect, useRef } from 'react';
import { BookingHeader } from './BookingHeader';

interface BookingFormProps {
  organizerName: string;
  onOrganizerNameChange: (name: string) => void;
  onBook: () => void;
  status: 'idle' | 'saving';
  error: string | null;
  showModal: boolean;
  confirmedBookingsCount: number;
  onCloseModal: () => void;
}

export function BookingForm({
  organizerName,
  onOrganizerNameChange,
  onBook,
  status,
  error,
  showModal,
  confirmedBookingsCount,
  onCloseModal,
}: BookingFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  return (
    <section className="flex-1 flex flex-col space-y-10">
      <BookingHeader title="Vem bokar?" />

      <div className="rounded-lg">
        <div className="space-y-4">
          <div>
            <label className="text-base font-medium text-black">
              Förnamn och efternamn
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
                onChange={(e) => onOrganizerNameChange(e.target.value)}
                placeholder="Skriv ditt fullständiga namn här"
                aria-describedby={error ? 'error-message' : undefined}
                aria-invalid={error ? 'true' : 'false'}
              />
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-600" id="error-message" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onBook}
        disabled={status === 'saving'}
        aria-live="polite"
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
        mt-auto mb-0 
        focus-visible:outline-2 
        focus-visible:outline-offset-2 
        focus-visible:outline-black
        "
      >
        {status === 'saving' ? 'Bokar...' : 'Boka'}
      </button>

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
        shadow-xl"
      >
        <p
          id="success-message"
          className="text-base text-black text-center flex flex-col items-center gap-2"
        >
          {confirmedBookingsCount === 1 ? 'Ditt rum är bokat!' : 'Dina rum är bokade!'}
          <span className="text-2xl" aria-hidden="true">
            ☺
          </span>
        </p>
      </dialog>
    </section>
  );
}
