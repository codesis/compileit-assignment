import React, { useEffect, useRef } from 'react';

interface BookingFormProps {
  selectedSlots: Set<string>;
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
      <header className="">
        <h2 className="text-5xl font-normal text-slate-900">Vem bokar?</h2>
      </header>

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
                aria-errormessage="error-message"
                aria-invalid={error ? 'true' : 'false'}
              />
            </label>
          </div>

          <p className="text-sm text-red-600" id="error-message">
            {error}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onBook}
        disabled={status === 'saving'}
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
        <p className="text-base text-black text-center flex flex-col items-center gap-2">
          {confirmedBookingsCount === 1 ? 'Ditt rum är bokat!' : 'Dina rum är bokade!'}
          <span className="text-2xl">☺</span>
        </p>
      </dialog>
    </section>
  );
}
