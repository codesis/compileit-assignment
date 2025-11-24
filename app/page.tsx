'use client';

import { useState } from 'react';
import { BookPage } from '@/components/BookPage';

export default function HomePage() {
  const [showBookPage, setShowBookPage] = useState(false);

  if (!showBookPage) {
    return (
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10 lg:py-16 h-screen min-h-full">
        <section className="flex flex-col justify-between h-full">
          <header>
            <h1 className="text-8xl font-normal text-slate-900 mt-20 min-h-fit">Boka ett rum</h1>
          </header>
          <button
            onClick={() => setShowBookPage(true)}
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
            Boka
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="
    mx-auto
    max-w-6xl
    space-y-8
    px-6
    pb-12
    pt-24
    lg:py-16
    min-h-screen
    h-full
    flex
    flex-col">
      <BookPage />
    </main>
  );
}
