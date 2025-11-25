import React from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface BookingNavProps {
  canNavigatePrev: boolean;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  displayedDates: Date[];
}

export function BookingNav({
  canNavigatePrev,
  onNavigatePrev,
  onNavigateNext,
  displayedDates,
}: BookingNavProps) {
  const dateRangeText =
    displayedDates.length > 0
      ? `${format(displayedDates[0], 'd MMM', { locale: sv }).replace('.', '')} - 
      ${format(displayedDates[displayedDates.length - 1], 'd MMM', { locale: sv }).replace('.', '')}`
      : '';

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onNavigatePrev}
        disabled={!canNavigatePrev}
        className="
        rounded-full 
        border 
        border-black 
        bg-white 
        px-2 
        py-1 
        text-sm 
        font-medium 
        text-slate-700 
        hover:outline 
        disabled:hover:outline-0 
        disabled:opacity-30 
        focus-visible:outline 
        focus-visible:outline-black
        "
        aria-label="Föregående datum"
      >
        ←
      </button>
      <h2 className="text-base font-normal text-slate-900 min-w-[120h2x] text-center">
        {dateRangeText.toLowerCase()}
      </h2>
      <button
        type="button"
        onClick={onNavigateNext}
        className="
        rounded-full 
        border 
        border-black 
        bg-white 
        px-2 
        py-1 
        text-sm 
        font-medium
         text-slate-700 
         hover:outline 
         focus-visible:outline 
         focus-visible:outline-black
         "
        aria-label="Kommande datum"
      >
        →
      </button>
    </div>
  );
}
