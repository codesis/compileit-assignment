import React from 'react';

export function BookingHeader() {
  const title: string = 'Välj en tid';

  return (
    <header>
      <h1 className="text-black text-5xl font-normal mb-6">{title}</h1>
    </header>
  );
}
